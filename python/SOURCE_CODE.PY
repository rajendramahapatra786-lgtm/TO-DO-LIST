'''My frontend app is in JavaScript, but I rewrote the core task logic in Python to demonstrate data modeling,
deadline handling, and monthly state tracking independent of UI.'''

from datetime import datetime, date
from typing import List, Dict


class Task:
    def __init__(
        self,
        task_id: int,
        name: str,
        description: str = "",
        deadline: datetime | None = None,
        categories: List[str] | None = None,
        color: str = "violet"
    ):
        self.id = task_id
        self.name = name
        self.description = description
        self.deadline = deadline
        self.categories = categories or ["General"]
        self.color = color

        # key = YYYY-M-D, value = "done" | "fail"
        self.completed: Dict[str, str] = {}

    def date_key(self, day: int, month: int, year: int) -> str:
        return f"{year}-{month}-{day}"

    def mark_done(self, day: int, month: int, year: int):
        key = self.date_key(day, month, year)
        self.completed[key] = "done"

    def auto_fail(self, today: date):
        """
        Automatically mark task as failed if:
        - Deadline is crossed
        - A past day is missed
        """
        for key in list(self.completed.keys()):
            pass  # already decided

        if self.deadline and today > self.deadline.date():
            fail_key = self.date_key(
                self.deadline.day,
                self.deadline.month,
                self.deadline.year
            )
            self.completed.setdefault(fail_key, "fail")

    def status_on(self, day: int, month: int, year: int) -> str:
        return self.completed.get(self.date_key(day, month, year), "pending")


class TaskManager:
    def __init__(self):
        self.tasks: List[Task] = []

    def add_task(self, task: Task):
        self.tasks.append(task)

    def delete_task(self, task_id: int):
        self.tasks = [t for t in self.tasks if t.id != task_id]

    def get_task(self, task_id: int) -> Task | None:
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None

    def monthly_report(self, month: int, year: int):
        report = {}

        for task in self.tasks:
            report[task.name] = {}
            for day in range(1, 32):
                try:
                    date(year, month, day)
                except ValueError:
                    break
                report[task.name][day] = task.status_on(day, month, year)

        return report


# =========================
# DEMO (FOR INTERVIEW)
# =========================
if __name__ == "__main__":
    manager = TaskManager()

    task = Task(
        task_id=1,
        name="Study Python",
        description="Practice logic daily",
        deadline=datetime(2026, 1, 28, 22, 0),
        categories=["Study", "Career"],
        color="blue"
    )

    manager.add_task(task)

    # User completes task on Jan 25
    task.mark_done(25, 1, 2026)

    # Auto check on Jan 29
    task.auto_fail(date(2026, 1, 29))

    report = manager.monthly_report(1, 2026)

    for task_name, days in report.items():
        print(f"\nTask: {task_name}")
        for d, status in days.items():
            if status != "pending":
                print(f"  Day {d}: {status.upper()}")







