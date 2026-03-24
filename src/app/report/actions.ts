"use server";

import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";
import { addReport, updateReportEvidence, type EvidenceFile } from "@/app/lib/mockStore";

export type FormState = {
  errors: Partial<Record<
    | "fullName"
    | "phone"
    | "email"
    | "governorate"
    | "incidentType"
    | "incidentDescription"
    | "incidentDate",
    string
  >>;
};

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8;
};

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_");

const saveEvidenceFiles = async (reportId: string, files: File[]) => {
  if (files.length === 0) return [] as EvidenceFile[];

  const baseDir = path.join(process.cwd(), "data", "evidence", reportId);
  fs.mkdirSync(baseDir, { recursive: true });

  const stored: EvidenceFile[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    try {
      const safeName = sanitizeFileName(file.name || `file-${index}`);
      const storedName = `${Date.now()}-${index}-${safeName}`;
      const filePath = path.join(baseDir, storedName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      stored.push({
        name: file.name,
        size: file.size,
        type: file.type,
        storedName
      });
    } catch {
      stored.push({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  }

  return stored;
};

export async function submitReport(_prevState: FormState, formData: FormData): Promise<FormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const governorate = String(formData.get("governorate") ?? "").trim();
  const incidentType = String(formData.get("incidentType") ?? "").trim();
  const incidentDescription = String(formData.get("incidentDescription") ?? "").trim();
  const incidentDate = String(formData.get("incidentDate") ?? "").trim();

  const errors: FormState["errors"] = {};

  if (!fullName) errors.fullName = "الاسم مطلوب.";
  if (!phone) {
    errors.phone = "رقم الهاتف مطلوب.";
  } else if (!isValidPhone(phone)) {
    errors.phone = "رقم الهاتف غير صحيح.";
  }

  if (!email) {
    errors.email = "البريد الإلكتروني مطلوب.";
  } else if (!isValidEmail(email)) {
    errors.email = "البريد الإلكتروني غير صحيح.";
  }

  if (!governorate) errors.governorate = "اختر المحافظة.";
  if (!incidentType) errors.incidentType = "اختر نوع البلاغ.";
  if (!incidentDescription) errors.incidentDescription = "وصف الحادث مطلوب.";
  if (!incidentDate) errors.incidentDate = "تاريخ الحادث مطلوب.";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const evidenceFiles = (formData.getAll("evidence") as File[]).filter(
    (file) => file instanceof File && file.size > 0
  );

  const report = addReport({
    fullName,
    phone,
    email,
    governorate,
    incidentType,
    incidentDescription,
    incidentDate,
    evidence: []
  });

  if (evidenceFiles.length > 0) {
    const storedEvidence = await saveEvidenceFiles(report.id, evidenceFiles);
    updateReportEvidence(report.id, storedEvidence);
  }

  redirect(`/report/success?id=${encodeURIComponent(report.id)}`);
}
