from datetime import datetime, timedelta
import json
from database import SessionLocal
from utils.embeddings import generate_embedding

def get_seed_jobs():
    """Generate ~50 synthetic job listings with variety"""
    roles = [
        ("Backend Engineer", ["Python", "PostgreSQL", "Docker", "AWS"]),
        ("Frontend Developer", ["React", "JavaScript", "CSS", "Git"]),
        ("Full Stack Engineer", ["Node.js", "React", "MongoDB", "TypeScript"]),
        ("Data Scientist", ["Python", "Machine Learning", "SQL", "Pandas"]),
        ("DevOps Engineer", ["Kubernetes", "Docker", "AWS", "Terraform"]),
        ("Mobile Developer", ["React Native", "Swift", "Kotlin"]),
        ("UI/UX Designer", ["Figma", "Adobe XD", "Prototyping"]),
        ("AI Engineer", ["Python", "PyTorch", "Deep Learning", "NLP"]),
        ("QA Engineer", ["Selenium", "Testing", "Automation", "Python"]),
        ("Cloud Architect", ["AWS", "Azure", "System Design", "Networking"]),
    ]

    companies = [
        "TechCorp", "WebStudio", "DataFlow", "CloudSystems", "DesignHub",
        "NextGenAI", "FinTechLabs", "HealthSoft", "EduPlus", "RetailX"
    ]

    locations = [
        "San Francisco, CA", "New York, NY", "Austin, TX",
        "Seattle, WA", "Los Angeles, CA", "Remote",
        "Boston, MA", "Chicago, IL", "Denver, CO", "Toronto, CA"
    ]

    job_types = ["Full-time", "Contract", "Remote", "Hybrid"]

    salaries = [
        (70000, 100000),
        (90000, 130000),
        (100000, 150000),
        (120000, 160000),
        (140000, 180000),
    ]

    descriptions = [
        "Join a fast-growing team working on scalable systems.",
        "We are looking for passionate engineers to build modern products.",
        "Work with cutting-edge technologies in a collaborative environment.",
        "Help us design and build high-quality software solutions.",
        "Opportunity to work on impactful projects with global reach.",
    ]

    jobs = []

    for i in range(50):
        role, reqs = roles[i % len(roles)]
        company = companies[i % len(companies)]
        location = locations[i % len(locations)]
        job_type = job_types[i % len(job_types)]
        salary_min, salary_max = salaries[i % len(salaries)]
        description = descriptions[i % len(descriptions)]

        title_prefix = ""
        if i % 5 == 0:
            title_prefix = "Senior "
        elif i % 7 == 0:
            title_prefix = "Junior "

        combined_text = f"{description} {' '.join(reqs)}"
        embedding = generate_embedding(combined_text)

        jobs.append({
            "title": f"{title_prefix}{role}",
            "company": company,
            "location": location,
            "salary_min": salary_min,
            "salary_max": salary_max,
            "job_type": job_type,
            "description": description,
            "requirements": json.dumps(reqs),
            "job_embedding": embedding,
        })

    return jobs

def get_seed_posts():
    return [
        {
            "author_id": 1,
            "content": "Just finished an amazing project with the team! Excited to share what we've built. #Engineering #Innovation",
        },
        {
            "author_id": 1,
            "content": "Looking for talented developers interested in AI/ML. We're hiring! Check our careers page.",
        },
        {
            "author_id": 1,
            "content": "Best practices for code review - communication and collaboration are key!",
        },
        {
            "author_id": 1,
            "content": "Excited to announce we're expanding our tech team! Open positions in backend, frontend, and data science.",
        },
        {
            "author_id": 1,
            "content": "Our new product launch was a success! Thank you to everyone who made it possible.",
        },
    ]

def get_seed_news():
    return [
        {
            "headline": "Tech Industry Sees Record Investment in 2024",
            "company": "TechNews Daily",
            "content": "The technology sector continues to attract significant venture capital funding as companies push the boundaries of innovation.",
        },
        {
            "headline": "Remote Work Trends Continue to Shape the Workplace",
            "company": "Business Insider",
            "content": "Companies worldwide are adapting to hybrid and remote work models, transforming how we work.",
        },
        {
            "headline": "AI and Machine Learning Transform Business Operations",
            "company": "AI Weekly",
            "content": "Artificial intelligence is revolutionizing how companies operate and serve their customers.",
        },
        {
            "headline": "Cybersecurity Threats Increase: What You Need to Know",
            "company": "Security Today",
            "content": "Organizations must strengthen their security posture in response to evolving threats.",
        },
        {
            "headline": "Top Programming Languages for 2024",
            "company": "Code Masters",
            "content": "Here are the most in-demand programming languages this year based on industry data.",
        },
    ]

def seed_database(db):
    try:
        from models.user import User
        from models.job import Job
        from models.post import Post
        from models.news import News

        existing_jobs = db.query(Job).count()
        if existing_jobs > 0:
            print("✓ Database already seeded. Skipping...")
            return

        for job_data in get_seed_jobs():
            job = Job(**job_data)
            db.add(job)

        for post_data in get_seed_posts():
            post = Post(**post_data)
            db.add(post)

        for news_data in get_seed_news():
            news = News(**news_data)
            db.add(news)

        db.commit()
        print("✓ Synthetic data seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"⚠ Seeding error: {str(e)}")