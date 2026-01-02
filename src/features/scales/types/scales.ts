export type UUID = string;

export type MinistryLite = {
    id: UUID;
    name: string;
};

export type MemberLite = {
    id: UUID;
    name: string;
    ministry_id: UUID;
};

export type ScaleMinistry = {
    id: UUID;
    name: string;
};

export type ScaleItem = {
    id: UUID;
    date: string;
    event: string;
    responsible: string;
    ministries: ScaleMinistry[];
};

export type CreateScaleInput = {
    date: string;
    event: string;
    responsible: string;
    ministries: ScaleMinistry[];
    assignments: Record<UUID, UUID[]>;
};
