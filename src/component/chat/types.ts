export type Message = {
    QCONV_ID: string;
    QBASED_ID: string;
    MSGNOT_ID: string;
    MSGNOT_message: string;
    QCONV_from_client: boolean;
    QCONV_from_business: boolean;
    QCONV_status: boolean;
    QCONV_received: boolean;
    QCONV_seen: boolean;
    QCONV_created_on: string;
};

export type PresetMessage = {
    MSGNOT_ID: string;
    MSGNOT_message: string;
};
