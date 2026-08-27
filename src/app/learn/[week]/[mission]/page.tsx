import { notFound } from "next/navigation";
import { getAllMissions, getMission } from "@/lib/curriculum";
import { getMissionState } from "@/lib/app-data";
import { MissionWorkspace } from "@/components/mission-workspace";
export const dynamic = "force-dynamic";
export default async function MissionPage({
  params,
}: {
  params: Promise<{ week: string; mission: string }>;
}) {
  const { week, mission: slug } = await params;
  const mission = getMission(week, slug);
  if (!mission) notFound();
  const state = await getMissionState(mission.id);
  if (!state) notFound();
  const all = getAllMissions();
  const index = all.findIndex((item) => item.id === mission.id);
  return (
    <MissionWorkspace
      {...state}
      previous={all[index - 1]}
      next={all[index + 1]}
    />
  );
}
