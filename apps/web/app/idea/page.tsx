// ✅ المسار الصحيح بناءً على صورتك
import IdeaSubmissionForm from "../../components/ideas/IdeaSubmissionForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Idea | Creative Platform",
  description: "Share your innovative ideas with our community.",
};

export default function Page() {
  return <IdeaSubmissionForm />;
}