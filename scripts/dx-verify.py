#!/usr/bin/env python3
"""Local Linux metadata-only checks. Never runs learner code or reads file contents."""
import argparse
import datetime
import json
import os
from pathlib import Path
import stat
import sys

CHECKS = {
    "mission-01": [("practice-directory", "week1/m1", "dir"), ("guided-notes", "week1/m1/docs/notes.txt", "file"), ("independent-notes", "week1/m1/independent/docs/notes.txt", "file"), ("evidence-directory", "week1/m1/evidence", "dir")],
    "mission-02": [("practice-directory", "week1/m2", "dir"), ("original-file", "week1/m2/original.txt", "file"), ("script-mode", "week1/m2/hello.sh", "700"), ("evidence-directory", "week1/m2/evidence", "dir")],
    "mission-03": [("practice-directory", "week1/m3", "dir"), ("process-observation", "week1/m3/evidence/process.txt", "file"), ("log-observation", "week1/m3/evidence/log.txt", "file"), ("incident-report", "week1/m3/evidence/incident.txt", "file")],
}

def inspect(root, relative, kind):
    """Open each component without following symlinks; fstat only, no content reads."""
    descriptors = []
    try:
        current = os.open("/", os.O_RDONLY | os.O_DIRECTORY)
        descriptors.append(current)
        parts = (root / relative).parts[1:]
        for index, part in enumerate(parts):
            flags = os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK
            if index < len(parts) - 1 or kind == "dir":
                flags |= os.O_DIRECTORY
            current = os.open(part, flags, dir_fd=current)
            descriptors.append(current)
        info = os.fstat(current)
        if info.st_uid != os.getuid():
            return False
        if kind == "dir":
            return stat.S_ISDIR(info.st_mode)
        return stat.S_ISREG(info.st_mode) and info.st_size > 0 and (kind != "700" or stat.S_IMODE(info.st_mode) == 0o700)
    except OSError:
        return False
    finally:
        for descriptor in reversed(descriptors):
            os.close(descriptor)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("week", choices=["week-01"])
    parser.add_argument("mission", choices=list(CHECKS))
    parser.add_argument("--practice-root", default=str(Path.home() / "dx-lab-practice"), help="Explicit practice directory named dx-lab-practice; no recursive scan")
    args = parser.parse_args()
    if sys.platform != "linux" or os.getuid() == 0:
        parser.error("Run in WSL/Ubuntu as a normal user, without sudo.")
    root = Path(os.path.abspath(os.path.expanduser(args.practice_root)))
    if root.name != "dx-lab-practice":
        parser.error("Practice root must be explicitly named dx-lab-practice.")
    checks = []
    for identifier, relative, kind in CHECKS[args.mission]:
        passed = inspect(root, relative, kind)
        checks.append({"id": identifier, "status": "pass" if passed else "fail", "evidence": "observed" if passed else "missing-or-unexpected"})
    passed = all(check["status"] == "pass" for check in checks)
    print(json.dumps({"schemaVersion": 1, "missionId": args.week + "-" + args.mission, "generatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"), "checks": checks, "overall": "pass" if passed else "fail"}, indent=2))
    return 0 if passed else 1

if __name__ == "__main__":
    sys.exit(main())
