type ApiSubmission = {
  jnf_id?: number;
  inf_id?: number;
  title?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type Proposal = {
  id: string;
  type: string;
  title: string;
  status: string;
  dateLabel: string;
  date: string;
  action: string;
  href: string;
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const toStatus = (status?: string | null) => {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "under_review":
      return "Under Review";
    case "open_edit":
      return "Open for Edit";
    case "submitted":
      return "Submitted";
    case "rejected":
      return "Rejected";
    default:
      return "Draft";
  }
};

const toAction = (status?: string | null) => {
  if (status === "accepted" || status === "rejected") return "View";
  return "Edit";
};

export const mapJnfToProposal = (item: ApiSubmission): Proposal | null => {
  if (!item.jnf_id) return null;

  const href = item.status === "accepted" || item.status === "rejected"
    ? `/dashboard/my-jnfs/${item.jnf_id}`
    : `/jnf/${item.jnf_id}/edit`;

  return {
    id: `JNF-${item.jnf_id}`,
    type: "JNF",
    title: item.title || `JNF ${item.jnf_id}`,
    status: toStatus(item.status),
    dateLabel: "Created",
    date: formatDate(item.created_at),
    action: toAction(item.status),
    href,
  };
};

export const mapInfToProposal = (item: ApiSubmission): Proposal | null => {
  if (!item.inf_id) return null;

  const href = item.status === "accepted" || item.status === "rejected"
    ? `/dashboard/my-infs/${item.inf_id}`
    : `/inf/${item.inf_id}/edit`;

  return {
    id: `INF-${item.inf_id}`,
    type: "INF",
    title: item.title || `INF ${item.inf_id}`,
    status: toStatus(item.status),
    dateLabel: "Created",
    date: formatDate(item.created_at),
    action: toAction(item.status),
    href,
  };
};
