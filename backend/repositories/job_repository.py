from models.job import Job
from sqlalchemy.sql import select


class JobRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self) -> list[Job]:
        return self.db.execute(select(Job)).scalars().all()

    def get_by_id(self, id: int):
        return self.db.execute(select(Job).where(Job.id == id)).scalars().first()

    def get_all_with_embeddings(self) -> list:
        """Get all jobs that have embeddings generated"""
        query = select(Job).where(Job.job_embedding != None)
        return self.db.execute(query).scalars().all()

    def get_by_id_with_embedding(self, id: int):
        """Get a specific job with its embedding"""
        query = select(Job).where((Job.id == id) & (Job.job_embedding != None))
        return self.db.execute(query).scalars().first()

    def save(self, job_data: dict) -> Job:
        job = Job(**job_data)
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job

    def update(self, id: int, job_data: dict) -> Job:
        job = self.get_by_id(id)
        if not job:
            return None
        for key, value in job_data.items():
            setattr(job, key, value)
        self.db.commit()
        self.db.refresh(job)
        return job

    def delete(self, id: int) -> Job:
        job = self.get_by_id(id)
        if not job:
            return None
        self.db.delete(job)
        self.db.commit()
        return job

    def search(self, filters: dict) -> list[Job]:
        """
        Search jobs by filters (NOT keyword - that's done in service with fuzzy matching)

        Filters applied:
        - location: Substring match
        - job_type: Exact match
        - salary_min/salary_max: Overlap match (job range overlaps search range)
        - company: Substring match
        """
        query = select(Job)

        if filters.get("location"):
            query = query.where(Job.location.ilike(f"%{filters['location']}%"))

        if filters.get("job_type"):
            query = query.where(Job.job_type == filters['job_type'])

        # Overlap condition: job's range overlaps with the searched range.
        # A job overlaps if its max >= search_min AND its min <= search_max.
        if filters.get("salary_min") and filters.get("salary_max"):
            query = query.where(
                (Job.salary_max >= filters["salary_min"]) &
                (Job.salary_min <= filters["salary_max"])
            )
        elif filters.get("salary_min"):
            query = query.where(Job.salary_max >= filters["salary_min"])
        elif filters.get("salary_max"):
            query = query.where(Job.salary_min <= filters["salary_max"])

        if filters.get("company"):
            query = query.where(Job.company.ilike(f"%{filters['company']}%"))

        return self.db.execute(query).scalars().all()
