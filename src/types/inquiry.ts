export type InquiryType = "GET_STARTED" | "BOOK_A_DEMO";

export type Inquiry = {
id: string;
email: string;
type: InquiryType;
createdAt: string;
};

export type InquiryListResponse = {
success: true;
data: Inquiry[];
};

export type InquiryItemResponse = {
success: true;
message?: string;
data: Inquiry;
};

export type InquiryErrorResponse = {
success: false;
message: string;
};
