import requests
import sys
from datetime import datetime
import uuid

class JobPortalAPITester:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
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

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                print(f"Response: {response.json()}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")

            return success, response.json() if success else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_register(self, email, password):
        """Test user registration"""
        test_data = {
            "username": f"test_user_{uuid.uuid4().hex[:8]}",
            "email": email,
            "password": password
        }
        return self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_data
        )

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
        """Test getting current user data"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        if success and '_id' in response:
            self.user_id = response['_id']
        return success

    def test_create_profile(self):
        """Test creating user profile"""
        profile_data = {
            "fullName": "Test User",
            "bio": "Test bio",
            "skills": ["Python", "JavaScript"],
            "experience": [{
                "title": "Software Engineer",
                "company": "Test Company",
                "location": "Remote",
                "from": "2020-01-01",
                "to": "2024-01-01",
                "current": False,
                "description": "Test role"
            }],
            "education": [{
                "school": "Test University",
                "degree": "Bachelor's",
                "fieldOfStudy": "Computer Science",
                "from": "2016-01-01",
                "to": "2020-01-01",
                "current": False,
                "description": "Test education"
            }],
            "location": "Test City",
            "contactInfo": {
                "email": "test@example.com",
                "phone": "1234567890",
                "socialMedia": {
                    "linkedin": "https://linkedin.com/test",
                    "twitter": "https://twitter.com/test",
                    "github": "https://github.com/test"
                }
            }
        }
        return self.run_test(
            "Create Profile",
            "POST",
            "profile",
            201,
            data=profile_data
        )

    def test_get_my_profile(self):
        """Test getting current user's profile"""
        return self.run_test(
            "Get My Profile",
            "GET",
            "profile/me",
            200
        )

    def test_get_profile_by_id(self):
        """Test getting profile by ID"""
        if not self.user_id:
            print("❌ No user ID available for profile lookup")
            return False, {}
        return self.run_test(
            "Get Profile by ID",
            "GET",
            f"profile/{self.user_id}",
            200
        )

    def test_chat_flow(self):
        """Test chat functionality"""
        # Start a new chat
        success, chat_response = self.run_test(
            "Start New Chat",
            "POST",
            "chat/start",
            201,
            data={"participantId": str(uuid.uuid4())}  # Using random ID for test
        )
        if not success:
            return False

        chat_id = chat_response.get('_id')
        if not chat_id:
            print("❌ No chat ID in response")
            return False

        # Send a message
        success, _ = self.run_test(
            "Send Message",
            "POST",
            f"chat/{chat_id}/message",
            201,
            data={"content": "Hello, this is a test message!"}
        )
        if not success:
            return False

        # Get chat by ID
        success, _ = self.run_test(
            "Get Chat by ID",
            "GET",
            f"chat/{chat_id}",
            200
        )
        if not success:
            return False

        # Get all chats
        return self.run_test(
            "Get All Chats",
            "GET",
            "chat",
            200
        )

def main():
    # Get backend URL from frontend .env
    import os
    from dotenv import load_dotenv
    load_dotenv('/app/frontend/.env')
    
    backend_url = os.getenv('REACT_APP_BACKEND_URL')
    if not backend_url:
        print("❌ Backend URL not found in frontend/.env")
        return 1

    # Setup
    tester = JobPortalAPITester(backend_url)
    test_email = f"test_{uuid.uuid4().hex[:8]}@test.com"
    test_password = "TestPass123!"

    # Run tests
    print("\n🚀 Starting API Tests...")

    # Test registration and login flow
    success, _ = tester.test_register(test_email, test_password)
    if not success:
        print("❌ Registration failed, stopping tests")
        return 1

    if not tester.test_login(test_email, test_password):
        print("❌ Login failed, stopping tests")
        return 1

    if not tester.test_get_current_user():
        print("❌ Get current user failed")
        return 1

    # Test profile management
    success, _ = tester.test_create_profile()
    if not success:
        print("❌ Profile creation failed")
        return 1

    success, _ = tester.test_get_my_profile()
    if not success:
        print("❌ Get my profile failed")
        return 1

    success, _ = tester.test_get_profile_by_id()
    if not success:
        print("❌ Get profile by ID failed")
        return 1

    # Test chat functionality
    success = tester.test_chat_flow()
    if not success:
        print("❌ Chat flow tests failed")
        return 1

    # Print results
    print(f"\n📊 Tests Summary:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
