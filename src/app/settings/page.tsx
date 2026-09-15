import { Download, Upload } from "lucide-react";
import { db } from "@/lib/db";
import {
  importBackupFormAction,
  updateSettingsFormAction,
} from "@/app/actions";
import { SubmitButton, ValidatedForm } from "@/components/interactive";
import { PageHeader } from "@/components/ui";
import { applicationVersion } from "@/lib/app-version";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await db.appSettings.upsert({
    where: { id: "local-settings" },
    update: {},
    create: { id: "local-settings" },
  });
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow={"Settings · v" + applicationVersion}
        title="Settings & Backup"
        description="Scheduling can change. Evidence requirements, quiz thresholds, incident independence, and hard gates cannot."
      />
      <ValidatedForm formAction={updateSettingsFormAction} className="card p-6">
        <div className="eyebrow">Daily study time</div>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[120, 240, 360, 480].map((minutes) => (
            <label key={minutes} className="cursor-pointer border border-[#303b48] bg-[#10161e] p-4 text-center has-[:checked]:border-[#4fcfc9] has-[:checked]:bg-[#102629]">
              <input
                type="radio"
                name="dailyStudyMinutes"
                value={minutes}
                defaultChecked={settings.dailyStudyMinutes === minutes}
                className="sr-only"
              />
              <div className="font-mono text-2xl font-black text-white">{minutes / 60}h</div>
              <div className="mt-1 text-xs text-[#7f8b98]">per day</div>
            </label>
          ))}
        </div>
        <label className="mt-7 flex items-start justify-between gap-5 border border-[#303b48] bg-[#10161e] p-5">
          <div>
            <div className="font-bold text-white">Accelerated Mode</div>
            <p className="mt-1 text-sm leading-6 text-[#8592a0]">
              Groups missions within the daily time budget. FAST never means SKIP.
            </p>
          </div>
          <input type="checkbox" name="acceleratedMode" defaultChecked={settings.acceleratedMode} className="mt-1 h-5 w-5 accent-[#54d7d1]" />
        </label>
        <div className="mt-6 flex justify-end">
          <SubmitButton>Save settings</SubmitButton>
        </div>
      </ValidatedForm>
      <section className="mt-6 border-t border-[#27313d] pt-6">
        <div className="eyebrow">Learner-state backup</div>
        <h2 className="mt-2 text-xl font-black text-white">Export and validated import</h2>
        <p className="mt-2 text-sm leading-6 text-[#8d9aaa]">
          Export includes progress, evidence, quiz and incident attempts, skills, settings, notes, bookmarks, week gates, oral reflections, and recall schedules. Older backups restore with an empty recall schedule.
        </p>
        <a href="/api/backup" download className="btn-primary mt-4">
          <Download size={15} /> Export learner backup JSON
        </a>
        <ValidatedForm formAction={importBackupFormAction} className="mt-6 border border-[#654938] bg-[#261c14] p-5">
          <div className="flex items-center gap-2 font-bold text-[#dfa46e]">
            <Upload size={16} /> Import replaces current learner state
          </div>
          <p className="mt-2 text-xs leading-5 text-[#c69a72]">
            Export the current state first. Import validates a strict versioned schema and runs transactionally.
          </p>
          <label className="mt-4 block text-xs font-bold text-[#d0a57c]">
            Backup JSON
            <textarea name="backup" className="field mt-2 min-h-48 resize-y font-mono text-xs" minLength={10} required />
          </label>
          <label className="mt-4 block text-xs font-bold text-[#d0a57c]">
            Type IMPORT LEARNER BACKUP to confirm
            <input name="confirmation" className="field mt-2" pattern="IMPORT LEARNER BACKUP" required />
          </label>
          <SubmitButton className="btn-secondary mt-4">Validate and import</SubmitButton>
        </ValidatedForm>
        <p className="mt-4 text-xs text-[#778493]">
          Direct SQLite backup, restore, upgrade, and rollback procedures are documented in docs/deployment.md.
        </p>
      </section>
    </div>
  );
}
