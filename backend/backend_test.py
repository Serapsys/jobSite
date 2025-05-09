import requests
import sys
from datetime import datetime
import uuid

class JobPortalAPITester:
    def __init__(self, base_url="https://24cbafac-4085-4391-8c34-1c5c3644bdff.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['x-auth-token'] = self.token

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print("No JSON response")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_register(self, username, email, password):
        """Test user registration"""
        success, response = self.run_test(
            "Register User",
            "POST",
            "auth/register",
            200,
            data={"username": username, "email": email, "password": password}
        )
        if success and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_login(self, email, password):
        """Test login and get token"""
        success, response = self.run_test(
            "Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_get_current_user(self):
        """Test getting current user profile"""
        return self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )

    def test_create_profile(self, fullName, bio, skills):
        """Test creating a user profile"""
        return self.run_test(
            "Create Profile",
            "POST",
            "profile",
            200,
            data={
                "fullName": fullName,
                "bio": bio,
                "skills": skills,
                "location": "Remote",
                "contactInfo": {
                    "email": "test@example.com",
                    "phone": "+1234567890"
                }
            }
        )

    def test_get_profile(self):
        """Test getting user profile"""
        return self.run_test(
            "Get Profile",
            "GET",
            "profile",
            200
        )

    def test_update_profile(self, fullName, bio, skills):
        """Test updating user profile"""
        return self.run_test(
            "Update Profile",
            "PUT",
            "profile",
            200,
            data={
                "fullName": fullName,
                "bio": bio,
                "skills": skills,
                "location": "Remote",
                "contactInfo": {
                    "email": "test@example.com",
                    "phone": "+1234567890"
                }
            }
        )

    def test_get_text_suggestions(self, text):
        """Test getting text suggestions from DeepSeek"""
        return self.run_test(
            "Get Text Suggestions",
            "POST",
            "suggestions",
            200,
            data={"text": text}
        )

def main():
    # Setup
    tester = JobPortalAPITester()
    test_username = f"test_user_{uuid.uuid4().hex[:8]}"
    test_email = f"test_{uuid.uuid4()}@test.com"
    test_password = "TestPass123!"
    test_fullname = "Test User"

    # Run tests
    print("\n🚀 Starting API Tests...")

    # Test Registration
    if not tester.test_register(test_username, test_email, test_password):
        print("❌ Registration failed, stopping tests")
        return 1

    # Test Login
    if not tester.test_login(test_email, test_password):
        print("❌ Login failed, stopping tests")
        return 1

    # Test Get Current User
    success, user = tester.test_get_current_user()
    if not success:
        print("❌ Get current user failed")
        return 1

    # Test Profile Creation
    success, _ = tester.test_create_profile(
        test_fullname,
        "I am a software developer",
        ["Python", "JavaScript", "React"]
    )
    if not success:
        print("❌ Profile creation failed")
        return 1

    # Test Profile Retrieval
    success, profile = tester.test_get_profile()
    if not success:
        print("❌ Profile retrieval failed")
        return 1

    # Test Profile Update
    success, _ = tester.test_update_profile(
        test_fullname,
        "I am an experienced software developer",
        ["Python", "JavaScript", "React", "Node.js"]
    )
    if not success:
        print("❌ Profile update failed")
        return 1

    # Test Text Suggestions
    success, suggestions = tester.test_get_text_suggestions(
        "I am a software"
    )
    if not success:
        print("⚠️ Text suggestions failed (expected if using test key)")

    # Print results
    print(f"\n📊 Tests Summary:")
    print(f"Total tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.2f}%")

    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())