import requests
import unittest
from datetime import datetime

class JobPortalAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.profile_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                return True, response.json() if response.text else {}
            else:
                print(f"❌ Failed - Status: {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_register(self, email, password):
        """Test user registration"""
        return self.run_test(
            "Register User",
            "POST",
            "auth/register",
            200,
            data={
                "username": email.split('@')[0],
                "email": email,
                "password": password
            }
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

    def test_create_profile(self, full_name):
        """Test profile creation"""
        success, response = self.run_test(
            "Create Profile",
            "POST",
            "profile",
            201,
            data={"fullName": full_name}
        )
        if success and '_id' in response:
            self.profile_id = response['_id']
        return success

    def test_get_all_profiles(self):
        """Test getting all profiles"""
        return self.run_test(
            "Get All Profiles",
            "GET",
            "profile/all",
            200
        )

    def test_get_profile(self, profile_id):
        """Test getting a specific profile"""
        return self.run_test(
            "Get Profile",
            "GET",
            f"profile/{profile_id}",
            200
        )

    def test_start_chat(self, participant_id):
        """Test starting a new chat"""
        return self.run_test(
            "Start Chat",
            "POST",
            "chat/start",
            201,
            data={"participantId": participant_id}
        )

    def test_send_message(self, chat_id, content):
        """Test sending a message"""
        return self.run_test(
            "Send Message",
            "POST",
            f"chat/{chat_id}/message",
            201,
            data={"content": content}
        )

    def test_get_suggestion(self, text, style):
        """Test getting text suggestions"""
        return self.run_test(
            "Get Text Suggestion",
            "POST",
            "suggestions",
            200,
            data={"text": text, "style": style}
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
    test_email = f"test_user_{datetime.now().strftime('%H%M%S')}@test.com"
    test_password = "TestPass123!"
    
    # Run tests
    print("\n🚀 Starting API Tests...")

    # 1. Register and Login
    success, _ = tester.test_register(test_email, test_password)
    if not success:
        print("❌ Registration failed, stopping tests")
        return 1

    if not tester.test_login(test_email, test_password):
        print("❌ Login failed, stopping tests")
        return 1

    # 2. Create and Get Profile
    if not tester.test_create_profile("Test User"):
        print("❌ Profile creation failed")
        return 1

    # 3. Get All Profiles
    success, profiles = tester.test_get_all_profiles()
    if not success:
        print("❌ Getting profiles failed")
        return 1

    # 4. Test Chat (if other profiles exist)
    if profiles and len(profiles) > 1:
        other_profile = next(p for p in profiles if p['_id'] != tester.profile_id)
        success, chat = tester.test_start_chat(other_profile['_id'])
        if success and '_id' in chat:
            tester.test_send_message(chat['_id'], "Hello! This is a test message.")

    # 5. Test Text Suggestions
    tester.test_suggestion(
        "Can you help me with my job application?",
        "formal"
    )

    # Print results
    print(f"\n📊 Tests Summary:")
    print(f"Total tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")

    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    import sys
    sys.exit(main())
