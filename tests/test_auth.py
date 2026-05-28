from unittest.mock import MagicMock
from tests.conftest import make_user

class TestC01_RegisterLogin:
    """C01 – Candidate register / login"""
 
    def test_register_success(self):
        from services.auth_service import AuthService
        db = MagicMock()
        svc = AuthService(db)
        svc.user_repo = MagicMock()
        svc.user_repo.get_by_email.return_value = None
        new_user = make_user()
        svc.user_repo.save.return_value = new_user
 
        result, status = svc.register({
            "email": "new@test.com",
            "password": "secret123",
            "full_name": "New User",
            "role": "candidate"
        })
        assert status == 201
        assert "message" in result
 
    def test_register_duplicate_email(self):
        from services.auth_service import AuthService
        db = MagicMock()
        svc = AuthService(db)
        svc.user_repo = MagicMock()
        svc.user_repo.get_by_email.return_value = make_user()
 
        result, status = svc.register({
            "email": "existing@test.com",
            "password": "pass",
            "full_name": "Dup",
            "role": "candidate"
        })
        assert status == 400
        assert "error" in result
 
    def test_register_missing_field(self):
        from services.auth_service import AuthService
        db = MagicMock()
        svc = AuthService(db)
        svc.user_repo = MagicMock()
 
        result, status = svc.register({
            "email": "x@test.com",
            "password": "",          # blank
            "full_name": "X",
            "role": "candidate"
        })
        assert status == 400
 
    def test_login_wrong_password(self):
        from services.auth_service import AuthService
        from werkzeug.security import generate_password_hash
        db = MagicMock()
        svc = AuthService(db)
        user = make_user()
        user.password = generate_password_hash("correct_password")
        svc.user_repo = MagicMock()
        svc.user_repo.get_by_email.return_value = user
 
        result, status = svc.authenticate({
            "email": "test@test.com",
            "password": "wrong_password"
        })
        assert status == 401
 
    def test_login_nonexistent_user(self):
        from services.auth_service import AuthService
        db = MagicMock()
        svc = AuthService(db)
        svc.user_repo = MagicMock()
        svc.user_repo.get_by_email.return_value = None
 
        result, status = svc.authenticate({
            "email": "ghost@test.com",
            "password": "pass"
        })
        assert status == 401
 
    def test_login_success_returns_token(self):
        from services.auth_service import AuthService
        from werkzeug.security import generate_password_hash
        db = MagicMock()
        svc = AuthService(db)
        user = make_user()
        user.password = generate_password_hash("correct_pass")
        svc.user_repo = MagicMock()
        svc.user_repo.get_by_email.return_value = user
 
        result, status = svc.authenticate({
            "email": "test@test.com",
            "password": "correct_pass"
        })
        assert status == 200
        assert "access_token" in result
 
class TestE01_EmployerRegisterLogin:
    """E01 – Employer register / login (same auth service, role='employer')"""
 
    def test_employer_register_success(self):
        from services.auth_service import AuthService
        db = MagicMock()
        svc = AuthService(db)
        svc.user_repo = MagicMock()
        svc.user_repo.get_by_email.return_value = None
        svc.user_repo.save.return_value = make_user(role="employer")
 
        result, status = svc.register({
            "email": "hr@company.com",
            "password": "pass1234",
            "full_name": "HR Manager",
            "role": "employer"
        })
        assert status == 201
 
    def test_employer_login_success(self):
        from services.auth_service import AuthService
        from werkzeug.security import generate_password_hash
        db = MagicMock()
        svc = AuthService(db)
        user = make_user(role="employer")
        user.password = generate_password_hash("mypassword")
        svc.user_repo = MagicMock()
        svc.user_repo.get_by_email.return_value = user
 
        result, status = svc.authenticate({"email": "hr@company.com", "password": "mypassword"})
        assert status == 200
        assert "access_token" in result