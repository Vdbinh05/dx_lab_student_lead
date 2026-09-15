"""Run in Ubuntu: python3 scripts/test-dx-verify.py. Uses only a fresh temp practice root."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name("dx-verify.py")
spec = importlib.util.spec_from_file_location("verifier", SCRIPT)
verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verifier)

class VerificationTests(unittest.TestCase):
    def test_artifacts_and_boundaries(self):
        with tempfile.TemporaryDirectory(prefix="dx-verify-qa-") as directory:
            root = Path(directory) / "dx-lab-practice"
            root.mkdir()
            for mission, checks in verifier.CHECKS.items():
                for _, relative, kind in checks:
                    target = root / relative
                    if kind == "dir":
                        target.mkdir(parents=True, exist_ok=True)
                    else:
                        target.parent.mkdir(parents=True, exist_ok=True)
                        target.write_text("Synthetic QA artifact, not learner evidence\n")
                        if kind == "700":
                            target.chmod(0o700)
                result = subprocess.run(["python3", str(SCRIPT), "week-01", mission, "--practice-root", str(root)], capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stderr)
                report = json.loads(result.stdout)
                self.assertEqual(report["overall"], "pass")
                self.assertNotIn(str(root), result.stdout)
            target = root / "week1/m1/docs/notes.txt"
            target.write_text("")
            self.assertFalse(verifier.inspect(root, "week1/m1/docs/notes.txt", "file"))
            target.unlink()
            target.symlink_to(root / "week1/m2/original.txt")
            self.assertFalse(verifier.inspect(root, "week1/m1/docs/notes.txt", "file"))
            target.unlink()
            os.mkfifo(target)
            self.assertFalse(verifier.inspect(root, "week1/m1/docs/notes.txt", "file"))
            script = root / "week1/m2/hello.sh"
            script.chmod(0o777)
            self.assertFalse(verifier.inspect(root, "week1/m2/hello.sh", "700"))
            self.assertFalse(verifier.inspect(root, "week1/m3/evidence/absent.txt", "file"))
            alias = Path(directory) / "alias"
            alias.symlink_to(root, target_is_directory=True)
            self.assertFalse(verifier.inspect(alias, "week1/m2/original.txt", "file"))
            result = subprocess.run(["python3", str(SCRIPT), "week-01", "mission-02", "--practice-root", str(root)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertEqual(json.loads(result.stdout)["overall"], "fail")

if __name__ == "__main__":
    unittest.main()
