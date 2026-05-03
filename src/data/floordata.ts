import type {
ImageAssets, TableData, StaffMember, ZoneData
} from "../types/floor"

export const IMGS: ImageAssets = {
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBH6lebbc8AHHLOuWdgQcxqYSgj7VBgud2mh6vNRqun2PtrMxBBi33sMphxEg1r3tj9pqvSXAM7qY8W9H8oiJ7vuA8MSF-2L-CsbfdtSRgOE327EYkI87kSwEVPesEARh0TxStyvGJD_wiGIfrzNvb8qJ3GuPE5Aw0xoIsjFuUKm8QKYBFEM-8Szju-RqkiHMrRf-39ij2gT-Dg4yuHWVLrXmZpJLiu5vBhNYp96WBfmMVo7EB6FmBi6ZWe10Lm-xe7tw0Vb6GVyNM",
  marcus: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOKrEmFl670_Ve32K-cBEkTVsgabnMYLq_pnuS4ou2kV9H6sDWv4EfjZg0WIKczt2qXGLaYYB6aqT1EJ8Oosvx8cNcenTKko3RFzfeNi-9D-B5Nj4QWSITOKjck_qmFOLoUOKaaut4IwsB0w6abF7zKc8bQV7gPnMqXzbmer1gHluXkiFoFqPoU8Lmin3Z-G9_cJ9h7PkvDbTzdug3HXO1WbuL86g4b1w1A3K1pJ-8yRYL953sRReACOVy2UzdGiZlC4XRrv9SIrM",
  marcusList: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm5EEWfRPf1Kd4nGN-frZ0sqbcopYd5allRxtCU7H5HB_YJ3D3HwjDeZvUPVQITh61deTshKn4pbZRBLq6iAMRAnIAsM86NGD2G7xAwjaTdr7umJFvKD83DWqDSfrYTp-_8YONoTMS-TCRYSDdHftnxG5JQLvQtyNYOnEPuAcrNSgXSf8K1TIf0oobSrhOzWklvwBmckZogz_n2GJ2TyqK0RwOFpndgvsFmOgMWyh17UqTFfPzzmx9VH5jmfXNHpqWqasNNvisr80",
  elena: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvJacjPOz0viQKlhL5nCuRhKJuuZ2VeG9kIUHsXoUVjH-TLwRNu733WlZWT3GBefld5oEA7s6lzUSa6KaOSr4_6Hy_-1gH5elnKsWs2264WWeWNVcO8u5R2jPZEXLp-LSM-Sh6spGQPChAAAjySezztkZKiteww-YISpMFuUbZBFBUS5HDAMeyuVrVkl5ICqbj5JtsgjpP1mnjULeoIRxB5iFbMSDWFGo8kALKqoiGcINGN2GKUQfYyjLiLqq44xVhqN1wJb5yWc",
  elenaList: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtc_Y3AjHYbSdgET31LGijukYuthcuS033aHR5tfXH6Fb22IFNgSjcAgJtvW5xMhL3u0JhvYdiTzeoEQHjFsk0hL-vf-0mqKzn6Vm-uG2N_SXC8FejctnNgQyVL41N_dU1rpnEAAcTFFlprzOdSnhHRMY-ZK34selyLjr3egazN-JMdln9QXnv8sew6S0zarfO52smAB2N4XXQy0XIx3ip_OB0j1lufmFZWXY08Yi49OkijVfUIqSCawticYyaKKp1Y2GflDPE3uQ",
  laurent: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEmtTE5S0HjvCSuQyaCTwTSM5BFPREpwzIPQo6NTitMQZoNoqjm9ajH3eMB5-loG2aTwuu4PtN_Uo4_GcAOKzchPGoyjdn2EtgyuRlEGCvSCRYNrdz4LA5L4oTjda5r-L3-xLbhWCQ6OJlraWX5pgVKr2NHPqj7izv1hpTULOQZmECs3SFEzp8-7TR3WueDifU7whpQmXUDLqOenUgmf_4cmJ281D4jjPxo73Bez73yLxM02olTcroTlt_z088eVrE5IPQObne8s4",
  laurentList: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRKD1XkDludqmdqPfTptDUfqlrgBlh6ooK2f_Z8qaRzptyg_435z4i7bQVk6_Dd6FJSQlIBfujE7Q_YGhYNoU7nAYgS9fpHaukMoKLQyALwizCjrLlpe97CpNDjr-nIuunZYx9gFuU8WaT9MemscgJWqo_WS8crBFo15IV61h_o5X1sDTO_DJSf4zfR0lB57R6F7HXuebvVbQ2_Znmxxzjyv83PanwApFjB9zQ1drdFl9icYrl5CHbZyxX9jTdQ5gnnByv_UvJNtE",
  sarah: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAZhaQ8RnIeIbrFDnLBlFkdcKVquDy_k_ltIi1y3U3NgXoahZODCYacqiG5aaVLoG3S0Fx66bRc9th7gihmNShRG4zbPFIvtSMOOjHyRQcs0criCC-dig_6yKKkeRs_RytebnvrcS7L66VLhXgJazpkvEGLgfz_H24c1sa3Og3Ih_Lu4jZsp2GJKmUkurH6eYJCPUimUb2mx_-4d1I35HJgnBh-_40QWaTwm6gnvVk2H4pUKD3VFRj3edKIMvSf3uNvvfYOJGZyXA",
  bgMap: "https://lh3.googleusercontent.com/aida-public/AB6AXuBevzsk5rzDnTnnNfHvxqycZkc5nnEgyZgLPdWUURfu-TnU0vlcGL6GWwNoRyMqJuVp_rEDerM-1jpEHgWQwHS-cG_epJ7GEvyweV_kwwyLQ-QKbntdCT-CPhVFA_FwJ4Ff4msH-uWpGhDo-vMcnlvvqaF01mrT3VPj-MrwsgQfqzqjnCKjjD8JlzkA7zdTjyi9tO3MBjJ5z66ALlEE4OvxMmoWggPxKmwST2VZchUrTlO_xmDGFvVGdyCvegnGdkCqwc8Ym0fZJtw",
};

export const tables: TableData[] = [
  { id: "T1" }, { id: "T2" },
  { id: "T3", staffImg: IMGS.elena, staffAlt: "Elena Rodriguez", staffPos: "-top-2 -right-2" },
  { id: "T4" },
  { id: "T5", indicator: "S2", indicatorPos: "-bottom-2 -left-2" },
  { id: "T6" },
  { id: "T7", indicator: "S3", indicatorPos: "-top-2 -right-2" },
  { id: "T8" }, { id: "T9" },
  { id: "T10", indicator: "S4", indicatorPos: "-bottom-2 -right-2" },
  { id: "T11", indicator: "S5", indicatorPos: "-top-2 -left-2" },
  { id: "T12" },
]

export const staffMembers: StaffMember[] = [
  {
    id: "1",
    name: "Marcus Chen",
    role: "Executive Chef",
    zone: "Kitchen & Pass",
    avatar: IMGS.marcus,
    onDuty: true,
  },
  {
    id: "2",
    name: "Elena Rodriguez",
    role: "Head Server",
    zone: "Main Dining Room",
    avatar: IMGS.elenaList,
    onDuty: true,
  },
  {
    id: "3",
    name: "Laurent Dubois",
    role: "Head Bartender",
    zone: "Bar & Lounge",
    avatar: IMGS.laurent,
    onDuty: true,
  },
  {
    id: "4",
    name: "Sarah Jenkins",
    role: "Maitre D'",
    zone: "Entrance & Host Stand",
    avatar: IMGS.sarah,
    onDuty: true,
  },
  {
    id: "5",
    name: "James Wilson",
    role: "Sous Chef",
    zone: "Kitchen & Pass",
    avatar: IMGS.staff2,
    onDuty: true,
  },
  {
    id: "6",
    name: "Maria Garcia",
    role: "Server",
    zone: "Main Dining Room",
    avatar: IMGS.staff3,
    onDuty: true,
  },
];

export const zoneData: ZoneData[] = [
  {
    name: "Kitchen & Pass",
    capacity: 10,
    currentStaff: 8,
    type: "kitchen",
  },
  {
    name: "Main Dining Room",
    capacity: 8,
    currentStaff: 6,
    type: "dining",
  },
  {
    name: "Bar & Lounge",
    capacity: 4,
    currentStaff: 4,
    type: "bar",
  },
  {
    name: "Entrance & Host Stand",
    capacity: 1,
    currentStaff: 1,
    type: "entrance",
  },
];