enum InquiryStatus {
    pending = "PENDING",
    resolved = "RESOLVED",
}
enum InquiryColor {
    pending = "#FF9100",
    resolved = "#32CD32",
}
enum PriceFilter {
    high_to_low = "HIGH_TO_LOW",
    low_to_high = "LOW_TO_HIGH"
}
enum NotificationType {
    email = "email",
    push = "push"
}
enum NotificationPageType {
    contact_us = "CONTACT_US"
}
enum Selects {
    all = "alluser",
    selected = "selecteduser",
    allartist = "allartist",
    both = "both"
}
enum GraphType {
    Yearly = 'Yearly',
    Monthly = 'Monthly',
    Six_Months = 'Six_Months',
    Weekly = 'Weekly',
    Daily = 'Daily',
}
enum Roles {
    DASHBOARD = "DASHBOARD",
    STAFF = "STAFFS",
    USERS = "USERS",
    MY_PRIFILE_SETTINS="MY_PRIFILE_SETTINGS",
    PAGES = "PAGES",
    FAQ = "FAQS",
    DB_BACKUP = "DB_BACKUP",
    ORDER = "ORDERS",
    TRANSACTION = "TRANSACTIONS",
    COMMISSION = "COMMISSION",
    CLOUD_MESSAGING = "CLOUD_MESSAGING",
    GENRES = "GENRES",
    VP_POINTS = "VP_POINTS",
    CONTACT_US = "CONTACT_US",
    BADGES = "BADGES",
    ARTISTS = "ARTISTS",
    REWARDS = "REWARDS",
    PAYOUT = "PAYOUT",
COMPANIES = "COMPANIES"
}

enum ArtistStatus {
    approved = "APPROVED",
    pending = "PENDING",
    rejected = "REJECTED"

}

export default {
    InquiryStatus,
    PriceFilter,
    GraphType,
    InquiryColor,
    NotificationType,
    NotificationPageType,
    Selects,
    Roles,
    ArtistStatus
}