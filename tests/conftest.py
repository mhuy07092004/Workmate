import sys
import os
from unittest.mock import MagicMock
from datetime import datetime

BACKEND_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "backend")
)

sys.path.insert(0, BACKEND_DIR)

def make_user(id=1, email="test@test.com", role="candidate", full_name="Test User"):
    u = MagicMock()
    u.id = id
    u.email = email
    u.role = role
    u.full_name = full_name
    return u

def make_profile(user_id=1, skills=None, work_experience=None,
                 preferred_mode=None, preferred_location=None,
                 resume_embedding=None, experiences=None):
    p = MagicMock()
    p.id = 1
    p.user_id = user_id
    p.full_name = "Test Candidate"
    p.email = "candidate@test.com"
    p.phone = "0400000001"
    p.education_level = "Bachelor"
    p.major = "Computer Science"
    p.school = "UOW"
    p.about_you = "Looking for work"
    p.resume_text = "Python developer with 3 years experience"
    p.resume_embedding = resume_embedding or [0.1] * 384
    p.experiences = experiences or []
    p.skills = skills if skills is not None else ["Python", "SQL"]
    p.work_experience = work_experience or []
    p.preferred_working_mode = preferred_mode or "Hybrid"
    p.preferred_location = preferred_location or "Sydney"
    p.is_premium = False
    return p

def make_job(id=1, title="Software Engineer", location="Sydney",
             job_type="Full-time", salary_min=80000, salary_max=120000,
             description="Build web apps", requirements="Python, FastAPI",
             job_embedding=None):
    j = MagicMock()
    j.id = id
    j.user_id = 2
    j.title = title
    j.company = "TechCorp"
    j.location = location
    j.job_type = job_type
    j.description = description
    j.requirements = requirements
    j.salary_min = salary_min
    j.salary_max = salary_max
    j.job_embedding = job_embedding or [0.2] * 384
    j.created_at = datetime(2025, 1, 1)
    return j

def make_employer_profile(user_id=2):
    e = MagicMock()
    e.id = 1
    e.user_id = user_id
    e.full_name = "HR Manager"
    e.email = "employer@company.com"
    e.company_name = "TechCorp"
    e.industry = "Technology"
    e.company_location = "Sydney"
    e.is_premium = False
    return e