import json
import re
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class PackageContractTests(unittest.TestCase):
    def test_root_skill_is_the_only_discoverable_entrypoint(self):
        entries = [path.relative_to(ROOT) for path in ROOT.rglob("SKILL.md") if ".git" not in path.parts]
        self.assertEqual(entries, [Path("SKILL.md")])

    def test_root_skill_stays_within_production_context_budget(self):
        self.assertLessEqual((ROOT / "SKILL.md").stat().st_size, 14_000)

    def test_manifest_and_frontmatter_versions_match(self):
        manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        name = re.search(r"^name:\s*([^\n]+)$", skill, re.MULTILINE)
        version = re.search(r'^\s+version:\s*"([^"]+)"$', skill, re.MULTILINE)
        self.assertIsNotNone(name)
        self.assertIsNotNone(version)
        self.assertEqual(manifest["name"], name.group(1).strip())
        self.assertEqual(manifest["version"], version.group(1))

    def test_generated_trigger_report_passes_every_case(self):
        report = json.loads((ROOT / "reports" / "trigger-eval.json").read_text(encoding="utf-8"))
        self.assertTrue(report["ok"])
        self.assertEqual(report["summary"]["passed"], report["summary"]["total"])

    def test_node_scripts_parse(self):
        for script in sorted((ROOT / "scripts").glob("*.mjs")):
            with self.subTest(script=script.name):
                result = subprocess.run(
                    ["node", "--check", str(script)],
                    cwd=ROOT,
                    capture_output=True,
                    text=True,
                    timeout=10,
                )
                self.assertEqual(result.returncode, 0, result.stderr)

    def test_evolution_ledger_verifies(self):
        result = subprocess.run(
            ["node", "scripts/qiaomu-design-evolution.mjs", "verify"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            timeout=10,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("verify passed", result.stdout)


if __name__ == "__main__":
    unittest.main()
