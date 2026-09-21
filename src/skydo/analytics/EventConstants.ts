export const Events = {
  // Signin events
  SIGNIN_EMAIL_SUBMIT: "onboarding_email_submit",
  EMAIL_OPT_SCREEN_LOAD: "onboarding_email_otp_screen_load",
  EMAIL_OTP_SUBMIT: "onboarding_email_otp_submit",
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILURE: "login_failure",
  PROPRIETORSHIP_ACKNOWLEDGEMENT: "onboarding_proprietorship_acknowledgement",
  FREELANCER_ACKNOWLEDGEMENT: "onboarding_freelancer_acknowledgement",
  HOME_PG_OUTSTANDING_CARD_CLICK: "home_pg_outstanding_card_click",
  HOME_PG_INPROGRESS_CARD_CLICK: "home_pg_inprogress_card_click",

  INTL_ACCOUNT_TAB_CHANGE: "intl_account_tab_change",

  // SOLE PROP DECLARATION
  SP_SIGN_DECLARATION_CLICKED: "sp_sign_declaration_clicked",
  SP_DECLARATION_ACCEPTED: "sp_declaration_accepted",
  SP_DECLARATION_SHOWN: "sp_declaration_shown",
  SP_DECLARATION_CANCELLED: "sp_declaration_cancelled",

  PLATFORMS_NEED_HELP_CLICKED: "platforms_need_help_clicked",
  PLATFORMS_REQUEST_CALLBACK_CLICKED: "platforms_request_callback_clicked",
  HAVE_MORE_QUESTIONS_SUBMIT: "have_more_questions_submit",
  ANALYTICS_CATEGORY_FEEDBACK_SUBMIT: "analytics_category_feedback_submit",
  ANALYTICS_PAGE_DETAILS_FEEDBACK_SUBMIT: "analytics_page_details_feedback_submit",
  ANALYTICS_CLIENT_FEEDBACK_SUBMIT: "analytics_client_feedback_submit",
  PLATFORM_INTEGRATION_FEEDBACK_SUBMIT: "platform_integration_feedback_submit",
  PLATFORM_INTEGRATION_HELP_SUBMIT: "platform_integration_help_submit",
  CLIENT_DETAILS_FEEDBACK_SUBMIT: "client_details_feedback_submit",
  INTL_ACCOUNTS_FEEDBACK_SUBMIT: "intl_accounts_feedback_submit",
  INTL_ACCOUNTS_FEEDBACK_SEE_DETAILS: "intl_accounts_feedback_see_details",
  REGIONAL_CURRENCY_BANNER_CTA_CLICKED: "regional_currency_banner_cta_clicked",
  REGIONAL_CURRENCY_BANNER_DISMISSED: "regional_currency_banner_dismissed",

  // Terms page consent events
  TNC_SCREEN_LOAD: "onboarding_begin_kyc_load",
  TNC_CLICK: "onboarding_begin_kyc_tc_click",
  PP_CLICK: "onboarding_begin_kyc_pp_click",
  TNC_CONSENT_SUBMIT: "onboarding_begin_kyc_submit",

  // UDYAM
  UDYAM_UPLOAD_ANOTHER_DOC: "udyam_upload_another_doc",

  // Entity info events
  ENTITY_SCREEN_LOAD: "onboarding_enter_entitypan_load",
  ENTITY_PAN_SUBMIT: "onboarding_entitypan_submit",
  ENTITY_COMPANY_DETAILS_LOAD: "onboarding_company_details_load",
  ENTITY_DETAILS_SUBMIT: "onboardin_company_details_submit",
  ENTITY_DEED_UPLOAD: "onboarding_deed_upload",
  SOLE_PROPS_DOC_UPLOAD: "onboarding_sole_props_doc_upload",
  ONBOARDING_DOCS_DROPDOWN_1_CLICKED: "onboarding_documents_dropdown1_clicked",
  ONBOARDING_DOCS_DROPDOWN_2_CLICKED: "onboarding_documents_dropdown2_clicked",
  ONBOARDING_DOCS_SHIPPING_METHOD_SELECTED: "onboarding_documents_shipping_method_selected",
  ONBOARDING_DOCS_CSB_SHIPPING_HELP_CLICKED: "onboarding_documents_csb_shipping_help_clicked",
  ENTITY_DEED_UPLOAD_FAILED: "onboarding_deed_upload_failed",
  SOLE_PROPS_DOC_UPLOAD_FAILED: "onboarding_sole_prop_doc_upload_failed",
  NAVIGATION_AWAY_WARNING_POPUP_LOAD: "onboarding_navigation_away_warning_popup_load",
  NAVIGATION_AWAY_WARNING_POPUP_DISCARD: "onboarding_navigation_away_warning_popup_discard",
  NAVIGATION_AWAY_WARNING_POPUP_CANCEL: "onboarding_navigation_away_warning_popup_cancel",

  // Business details form events
  BUSINESS_DETAILS_LOAD: "business_details_load",
  PAN_EDIT_CLICKED: "pan_edit_clicked",
  CHANGE_PAN_POPUP_CLOSED: "change_pan_popup_closed",
  CHANGE_PAN_POPUP_CONFIRMED: "change_pan_popup_confirmed",
  NO_ONLINE_PRESENCE_CLICKED: "no_online_presence_clicked",
  BUSINESS_DESCRIPTION_DISMISSED: "business_description_dismissed",
  BUSINESS_DESCRIPTION_COMPLETED: "business_description_completed",
  PER_PAYMENT_AMOUNT_SELECTED: "per_payment_amount_selected",
  MONTHLY_INCOME_SELECTED: "monthly_income_selected",
  GSTIN_SELECTED: "gstin_selected",
  COMMUNICATION_NAME_EDITED: "communication_name_edited",
  BILLING_ADDRESS_EDITED: "billing_address_edited",
  WEBSITE_VERIFIED: "website_verified",
  WEBSITE_VERIFICATION_FAILED: "website_verification_failed",

  // Visit FAQ Clicked
  VISIT_FAQ_CLICKED: "visit_faq_clicked",

  /**
   * PAYMENT CONFIRMATION
   */
  PC_CTA_CLICKED: "pc_cta_clicked", // ✅
  PC_POPUP_SHOWN: "pc_popup_shown", // ✅
  PC_POPUP_TO_FOCUS: "pc_popup_to_focus", // ✅
  PC_POPUP_CC_FOCUS: "pc_popup_cc_focus", // ✅
  PC_POPUP_AUTO_SEND_CHECKBOX_CLICKED: "pc_popup_auto_send_checkbox_clicked", // enable, disable // ✅
  PC_POPUP_SEND_CLICKED: "pc_popup_send_clicked", // ✅
  PC_POPUP_SEND_TEST_CLICKED: "pc_popup_send_test_clicked", // ✅
  CLIENT_CARD_AUTO_SEND_TOGGLED: "client_card_auto_send_toggled", // enable, disable // ✅
  CLIENT_CARD_SETTINGS_DROPDOWN_CLICKED: "client_card_settings_dropdown_clicked", // expand, collapse
  CLIENT_CARD_EMAIL_FIELD_FOCUS: "client_card_email_field_focus", // ✅
  CLIENT_CARD_EMAIL_FIELD_SAVED: "client_card_email_field_saved", // ✅
  CLIENT_CARD_SAMPLE_EMAIL_VIEWED: "client_card_sample_email_viewed",

  /**
   * CLIENT LEDGER Events
   */
  CLIENTS_PAGE_LOAD: "clients_page_load", // ✅
  CLIENT_CARD_CLICK: "client_card_click", // ✅
  CLIENT_CARD_ANALYTICS_CLICK: "client_card_analytics_click", // ✅
  CLIENT_CARD_LEDGER_CLICK: "client_card_ledger_click", // ✅
  CLIENT_LEDGER_PAGE_LOAD: "client_ledger_page_load", // ✅
  CLIENT_LEDGER_TIME_DROPDOWN_VIEW: "client_ledger_time_dropdown_view", // ✅
  CLIENT_LEDGER_TIME_DROPDOWN_SELECT: "client_ledger_time_dropdown_select", // ✅
  CLIENT_LEDGER_ANALYTICS_CLICK: "client_ledger_analytics_click", // ✅
  CLIENT_LEDGER_OUTSIDE_DOWNLOAD_LEDGER: "client_ledger_outside_download_ledger", // ✅
  CLIENT_LEDGER_SHARE_CLICK: "client_ledger_share_click", // ✅
  CLIENT_LEDGER_SHARE_POPUP_LOAD: "client_ledger_share_popup_load", // ✅
  CLIENT_LEDGER_SHARE_POPUP_COPY_LINK: "client_ledger_share_popup_copy_link", // ✅
  CLIENT_LEDGER_SHARE_POPUP_PREVIEW_CLICK: "client_ledger_share_popup_preview_click", // ✅
  CLIENT_LEDGER_SHARE_POPUP_SHARE_EMAIL_CLICK: "client_ledger_share_popup_share_email_click", // ✅
  CLIENT_LEDGER_EMAIL_TEST_EMAIL_SECTION_CLICK: "client_ledger_email_test_email_section_click", // ✅
  CLIENT_LEDGER_EMAIL_TEST_TO_FOCUS: "client_ledger_email_test_to_focus", // ✅
  CLIENT_LEDGER_EMAIL_TEST_SEND_CLICK: "client_ledger_email_test_send_click", // ✅
  CLIENT_LEDGER_EMAIL_TO_FOCUS: "client_ledger_email_to_focus", // ✅
  CLIENT_LEDGER_EMAIL_CC_FOCUS: "client_ledger_email_cc_focus", // ✅
  CLIENT_LEDGER_EMAIL_BCC_FOCUS: "client_ledger_email_bcc_focus", // ✅
  CLIENT_LEDGER_EMAIL_ADD_LOGO_CLICK: "client_ledger_email_add_logo_click", // ✅
  CLIENT_LEDGER_EMAIL_SEND_CLICK: "client_ledger_email_send_click", // ✅
  PUB_CLIENT_LEDGER_VIEW_ACCOUNTS_CLICK: "pub_client_ledger_view_accounts_click", // ✅
  CLIENT_LEDGER_FINAL_DOWNLOAD: "client_ledger_final_download", // ✅
  POWERED_BY_SKYDO: "powered_by_skydo", // ✅

  // Client List Events
  CLIENT_ADD_CLIENT: "client_add_client",
  CLIENT_ACTIONS_OPEN: "client_actions_open",
  CLIENT_ACTIONS_CLICK: "client_actions_click",
  CLIENT_ADD_BUSINESS_NAME_FOCUS: "client_add_client_business_name_focus",
  CLIENT_ADD_PRIMARY_NAME_FOCUS: "client_add_client_primary_name_focus",
  CLIENT_ADD_SAME_AS_BUSINESS_NAME: "client_add_client_same_as_business_name_click",
  CLIENT_ADD_EMAIL_FOCUS: "client_add_client_email_focus",
  CLIENT_ADD_PHONE_FOCUS: "client_add_client_phone_focus",
  CLIENT_WEBSITE_FOCUS: "client_add_client_website_focus",
  CLIENT_ADD_CANCEL: "client_add_client_cancel_click",
  CLIENT_ADD_SAVE: "client_add_client_save_click",
  CLIENT_ADD_BUSINESS_DETAILS_OPEN: "client_add_client_business_details_section_open",
  CLIENT_ADD_COUNTRY_DETAILS_SELECT: "client_add_client_country_select",
  CLIENT_ADD_ADDRESS_FOCUS: "client_add_client_address_focus",
  CLIENT_ADD_GST_FOCUS: "client_add_client_gstin_focus",
  CLIENT_ADD_GST_VERIFY_CLICK: "client_add_client_gstin_verify_click",
  CLIENT_VIEW_ANALYTICS_CLICK: "client_view_analytics_click",
  CLIENT_VIEW_LEDGER_CLICK: "client_view_ledger_click",
  CLIENT_VIEW_INVOICES_CLICK: "client_view_invoices_click",
  CLIENT_CREATE_INVOICE_CLICK: "client_create_invoice_click",
  CLIENT_DETAILS_EDIT_CLICK: "client_client_details_edit_click",
  CLIENT_OTHER_DETAILS_ADD_CLICK: "client_other_details_add_click",
  CLIENT_DETAILS_NOTE_FOCUS: "client_details_note_focus",
  CLIENT_DETAILS_FILE_UPLOAD: "client_details_file_upload",
  CLIENT_DETAILS_SHARE_FEEDBACK: "client_details_share_feedback",
  CLIENT_ADD_NOTES_AND_CONTRACT_OPEN: "client_add_notes_and_contract_open",

  // Personal details events
  PERSONAL_SCREEN_LOAD: "onboarding_personal_pan_load",
  PERSONAL_PAN_UPLOAD: "onboarding_personal_pan_upload",
  AADHAR_VERIFY_CLICK: "onboarding_aadhaar_verify_click",
  GENERATE_DIGILOCKER_AADHAAR_LINK: "onboarding_generate_digilocker_aadhaar_link",
  AADHAR_OTP_SUBMIT: "onboarding_aadhaar_otp_submit",
  MOBILE_VERIFY_CLICK: "onboarding_verify_mobile_click",
  MOBILE_OTP_SUBMIT: "onboarding_mobile_otp_submit",

  // UBO details events
  UBO_SCREEN_LOAD: "onboarding_ubo_load",
  UBO_ADD_NEW_CLICK: "onboarding_ubo_add_new_click",
  UBO_CONSENT_GIVEN: "onboarding_ubo_consent_given",
  UBO_SUBMIT: "onboarding_ubo_submit",
  ALT_UBO_DATA_SUBMIT: "onboarding_alt_ubo_data_submit",

  // Bank account verification events
  BANK_VERIFICATION_SCREEN_LOAD: "onboarding_bank_details_load",
  BANK_VERIFICATION_SUBMIT: "onboarding_bank_details_submit",
  BANK_AC_INT_TXNS_YES_CLICKED: "bankAC_int_txns_yes_clicked",
  BANK_AC_INT_TXNS_NO_CLICKED: "bankAC_int_txns_no_clicked",
  BANK_AC_INT_TXNS_SUBMITTED: "bankAC_int_txns_submitted",
  CONTRACT_UPLOAD_OPTION_SELECTED: "contract_upload_option_selected",
  CONTRACT_UPLOAD_INITIATED: "contract_upload_initiated",
  CONTRACT_UPLOAD_SUCCESSFUL: "contract_upload_successful",
  CONTRACT_UPLOAD_FAILED: "contract_upload_failed",
  FREELANCER_CONTRACT_SUBMITTED: "freelancer_contract_submitted",
  CHOOSE_OTHER_DOCUMENTS_SELECTED: "choose_other_documents_selected",

  // Final verification step
  FINAL_VERIFICATION_SCREEN_LOAD: "onboarding_final_loader_load",
  ACCOUNT_CREATED: "onboarding_account_success",
  ACCOUNT_PENDING: "onboarding_account_waiting",
  ONBOARDING_COMPLETE: "onboarding_form_complete",

  //Dashboard Events
  TRANSACTION_ROW_CLICK: "home_invoice_click",

  PARSED_INVOICE_WITH_UNPARSED_URL: "parsed_invoice_with_unparsed_url",
  COPY_VA_DETAILS_CLICK: "copy_va_details_click",
  COPY_VA_DETAILS_CLICK_BUTTON: "copy_va_details_click_button",
  COPY_INVOICE_EMAIL_CLICK: "copy_invoice_email_click",
  VIEW_MORE_ACCOUNT_DETAILS_CLICK: "view_more_account_details_click",
  FX_CALCULATOR_OPENED: "skydo_fee_and_fx_calc_opened",
  VIEW_ALL_PAYMENTS_CLICK: "view_all_payments_click",
  INVOICE_IMAGE_CLICK: "invoice_image_click",
  FIRA_DOWNLOAD_SUCCESS: "invoice_details_fira_download_success",
  FIRA_DOWNLOAD_ERROR: "invoice_details_fira_download_error",
  SKYDO_RECEIPT_DOWNLOAD_SUCCESS: "invoice_details_skydo_receipt_success",
  SKYDO_RECEIPT_DOWNLOAD_ERROR: "invoice_details_skydo_receipt_error",
  SKYDO_CREDIT_NOTE_DOWNLOAD_SUCCESS: "invoice_details_skydo_credit_note_success",
  SKYDO_CREDIT_NOTE_DOWNLOAD_ERROR: "invoice_details_skydo_credit_note_error",
  FIRA_DOWNLOAD_TABLE_CLICK: "payments_table_fira_download_click",

  LOGOUT_CLICK: "logout_click",
  MY_PROFILE_CTA_CLICK: "my_profile_cllick",
  HEADER_SKYDO_ICON_CLICK: "header_skydo_icon_click",
  HEADER_HELP_ICON_CLICK: "header_help_icon_click",
  HEADER_USER_PROFILE_CLICK: "header_user_profile_click",
  VIEW_PAYMENTS_AND_SKYDO_CHARGES_CLICK: "view_payments_and_skydo_charges_click",
  PROFILE_CARD_REFER_AND_EARN_CLICK: "profile_card_refer_and_earn_click",

  //Purpose code
  REMOVE_PC_CONFIRM: "remove_pc_click",
  SAVE_PC_FOR_INVOICE: "save_pc_for_invoice",
  SUBMIT_DEFAULT_PC: "submit_default_pc",
  REMOVE_DEFAULT_PC_CLICK: "remove_default_pc_click",
  SKIP_DEFAULT_PC_CLICK: "skip_default_pc_click",
  UNDO_SKIP_DEFAULT_CLICK: "undo_skip_default_click",
  ADD_INVOICE_PC_CLICK: "add_invoice_pc_click",
  CHANGE_PC_PROFILE_PAGE_CLICK: "change_pc_profile_page_click",
  PURPOSE_CODE_POPUP_OPEN: "purpose_code_popup_open",
  AMAZON_SHIPPING_METHOD_SELECTED: "amazon_shipping_method_selected",
  PURPOSE_CODE_SELECTED: "purpose_code_selected",
  PURPOSE_CODE_POPUP_CLOSE: "purpose_code_popup_close",
  PURPOSE_CODE_ERROR: "purpose_code_error",
  SOFTEX_FILING_ANSWER_SELECTED: "softex_filing_answer_selected",

  //Public Bank Account Page
  PUBLIC_ACCOUNT_LOCATION_UPDATE: "public_account_location_update",
  PUBLIC_ACCOUNT_CURRENCY_UPDATE: "public_account_currency_update",
  PUBLIC_ACCOUNT_VALUE_COPIED: "public_account_value_copied",
  PUBLIC_ACCOUNT_MOBILE_NOT_SUPPORTED: "public_account_mobile_not_supported",
  PUBLIC_ACCOUNT_PAYMENT_METHOD_INFO_BOX: "public_account_payment_method_info_box",

  //International Accounts Page

  INTERNATIONAL_ACCOUNTS_LOCATION_SELECTED: "international_accounts_location_selected",
  INTERNATIONAL_ACCOUNTS_SHARE_CLICK: "international_accounts_share_click",
  INTERNATIONAL_ACCOUNTS_SHARE_PREVIEW_CLICK: "international_account_share_preview_click",
  LOGO_UPLOAD_CLICK: "logo_upload_click", // ✅
  EDIT_LOGO_CLICK: "edit_logo_click", // ✅
  LOGO_UPLOAD_P1_LOAD: "logo_upload_p1_load", // ✅
  LOGO_UPLOAD_P2_LOAD: "logo_upload_p2_load", // ✅
  LOGO_UPLOAD_CONFIRM_CLICK: "logo_upload_confirm_click", // ✅
  LOGO_UPLOAD_EDIT_LOGO_CLICK: "logo_upload_edit_logo_click", // ✅
  INTERNATIONAL_ACCOUNTS_SHARE_COPY_LINK_CLICK: "international_accounts_share_copy_link_click",
  INTERNATIONAL_ACCOUNT_COPY_DETAILS: "international_account_copy_details",
  INTERNATIONAL_ACCOUNT_PAYMENT_METHOD_CLICK: "international_account_payment_method_click",
  INVOICE_DETAILS_PAGE: "invoices_details_page_load",
  INTERNATIONAL_ACCOUNTS_PAGE_CLICK: "international_accounts_page_load",
  PLATFORM_ACCOUNTS_VALUE_COPIED: "platform_accounts_value_copied",
  IA_ACCOUNT_VALUE_COPIED: "IA_account_value_copied",

  URL_VALIDATION_FAILED: "url_validation_failed",

  /**
   * Payment Reminder Events
   */
  CLIENT_REMINDER_POPUP_LOAD: "client_reminder_popup_load", // ✅
  CLIENT_REMINDER_TEST_EMAIL_SECTION_CLICK: "client_reminder_test_email_section_click", // ✅
  CLIENT_REMINDER_TEST_TO_FOCUS: "client_reminder_test_to_focus", // ✅
  CLIENT_REMINDER_TEST_SEND_CLICK: "client_reminder_test_send_click", // ✅
  CLIENT_REMINDER_TO_FOCUS: "client_reminder_to_focus", // ✅
  CLIENT_REMINDER_CC_FOCUS: "client_reminder_cc_focus", // ✅
  CLIENT_REMINDER_BCC_FOCUS: "client_reminder_bcc_focus", // ✅
  CLIENT_REMINDER_ADD_LOGO_CLICK: "client_reminder_add_logo_click", // ✅
  CLIENT_REMINDER_SEND_CLICK: "client_reminder_send_click", // ✅

  MOBILE_INPUT_LOGIN_FOCUS: "mobile_input_login_focus",
  MOBILE_INPUT_LOGIN_SUBMIT: "mobile_input_login_submit",

  /**
   * Test Transaction
   * */
  TEST_TRANSACTION_HOME_PAGE: "TEST_TRANSACTION_HOME_PAGE",
  TEST_TRANSACTION_INITIATE: "TEST_TRANSACTION_INITIATE",
  TEST_TRANSACTION_INITIATE_CLICK: "TEST_TRANSACTION_INITIATE_CLICK",
  TEST_TRANSACTION_TRANSFER: "TEST_TRANSACTION_TRANSFER",
  TEST_TRANSACTION_TRACK: "TEST_TRANSACTION_TRACK",
  TEST_TRANSACTION_FAILED: "TEST_TRANSACTION_FAILED",
  TEST_TRANSACTION_CLOSE_CLICK: "TEST_TRANSACTION_CLOSE_CLICK",

  /**
   * Filters events
   */
  FILTERS_CLEAR_ALL_CLICK: "filters_clear_all_click",
  FILTERS_DROPDOWN_CLICK: "filters_dropdown_click",
  FILTERS_APPLIED: "filters_applied",
  FILTERS_DROPDOWN_CLEAR_FILTER_CLICK: "filters_dropdown_clear_filter_click",
  SORT_DROPDOWN_CLICK: "sort_dropdown_click",
  SORT_OPTION_CLICK: "sort_option_click",
  SORT_ORDER_CLICK: "sort_order_click",
  FILTERS_TABLE_NEXT_PAGE_CLICK: "filters_table_next_page_click",
  FILTERS_TABLE_PREV_PAGE_CLICK: "filters_table_prev_page_click",

  /**
   * Referral events
   */
  LOGIN_PAGE_LOAD: "login_page_load",
  REFERRAL_PAGE_LOAD: "referral_page_load",
  REFERRAL_COPY_LINK_CLICK: "referral_copy_link_click",
  REFERRAL_TWITTER_SHARE_CLICK: "referral_twitter_share_click",
  REFERRAL_EMAIL_SHARE_CLICK: "referral_email_share_click",
  REFERRAL_FB_SHARE_CLICK: "referral_fb_share_click",
  REFERRAL_WHATSAPP_SHARE_CLICK: "referral_whatsapp_share_click",
  REFERRAL_LINKEDIN_SHARE_CLICK: "referral_linkedin_share_click",
  REFERRAL_WIDGET_INVITE_FRIENDS_CLICK: "referral_widget_invite_friends_click",
  REFERRAL_WIDGET_LOADED: "referral_widget_loaded",
  REFERRAL_BANNER_SHOWN: "referral_banner_shown",
  REFERRAL_BANNER_SKIP: "referral_banner_skip",
  REFERRAL_BANNER_KNOW_MORE: "referral_banner_know_more",
  IMPORTER_OFFER_BANNER_VIEWED: "importer_offer_banner_viewed",
  IMPORTER_OFFER_BANNER_DISMISSED: "importer_offer_banner_dismissed",
  SHARE_ACCOUNT_CTA_CLICKED: "share_account_cta_clicked",
  IMPORTER_OFFER_BANNER_EXPANDED: "importer_offer_banner_expanded",
  IMPORTER_OFFER_BANNER_COLLAPSED: "importer_offer_banner_collapsed",
  REFERRAL_PAYMENT_TRACKER_NUDGE_CLICKED: "referral_payment_tracker_nudge_clicked",
  REFERRAL_TRACK_REFERRAL_CLICK: "referral_track_referral_click",
  REFERRAL_UNDERSTANDING_CLICK: "referral_understanding_click",
  REFERRAL_TERMS_AND_CONDITIONS_CLICK: "referral_terms_and_conditions_click",
  REFERRAL_SIDE_PANEL_CLICK: "referral_side_panel_click",
  REFERRAL_MILESTONE_CLAIM_CTA_CLICK: "referral_milestone_claim_cta_click",
  REFERRAL_MILESTONE_CLAIM_CONFIRM_CLICK: "referral_milestone_claim_confirm_click",
  REFERRAL_MILESTONE_KEEP_REFERRING_CLICK: "referral_milestone_keep_referring_click",
  REFERRAL_LOGIN_PAGE_LOAD: "referral_login_page_load",
  GOOGLE_SIGNUP_CLICKED: "google_signup_clicked",
  LOGIN_SCREEN_SIGNUP_CLICKED: "login_screen_signup_clicked",
  LOGIN_SCREEN_SIGNUP_ERROR: "login_screen_signup_error",
  LOGIN_SCREEN_OTP_INPUT: "login_screen_otp_input",
  LOGIN_SCREEN_OTP_SUBMIT: "login_screen_otp_submit",
  LOGIN_SCREEN_OTP_SUCCESS: "login_screen_otp_success",
  LOGIN_SCREEN_OTP_ERROR: "login_screen_otp_error",
  LOGIN_SCREEN_PHONE_SUCCESS: "login_screen_phone_success",
  LOGIN_SCREEN_PHONE_ERROR: "login_screen_phone_error",

  // Upload invoice events
  UPLOAD_INVOICE_BUTTON_CLICK: "upload_invoice_button_click",
  UPLOAD_PARSE_SUCCESS: "upload_parse_success",
  UPLOAD_PARSE_FAILURE: "upload_parse_failure",
  UPLOAD_SUCCESS: "upload_success",
  UPLOAD_INVOICE_CLOSE_INITIATE: "upload_invoice_close_initiate",
  UPLOAD_INVOICE_CLOSE_CONFIRM: "upload_invoice_close_confirm",
  UPLOAD_INVOICE_CLOSE_CANCEL: "upload_invoice_close_cancel",
  UPLOAD_INVOICE_CLOSE_WITHOUT_UPLOAD: "upload_invoice_close_without_upload",
  UPLOAD_INVOICE_ALTERNATE: "upload_invoice_alternate",
  UPLOAD_INVOICE_CONFIRM: "upload_invoice_confirm",
  UPLOAD_INVOICE_CHECKLIST_VIEWED: "upload_invoice_checklist_viewed",
  INVOICE_DATA_QUALITY_ISSUE_SHOWN: "invoice_data_quality_issue_shown",
  INVOICE_VERIFY_VERIFICATION_SELECTED: "invoice_verify_verification_selected",
  INVOICE_DATA_QUALITY_MODAL_DISMISSED: "invoice_data_quality_modal_dismissed",
  INVOICE_EXTRACTION_STARTED: "invoice_extraction_started",

  //POST INVOICE FINALIZATION POP UP
  POST_FINALIZATION_DOWNLOAD_CLICK: "post_finalization_download_invoice",
  POST_FINALIZATION_EMAIL_CLICK: "post_finalization_email_click",

  // Mutli User
  ADD_MEMBER_CLICK: "add_member_click",
  ADD_MEMBER_CONTINUE_CLICK: "add_member_continue_click",
  ADD_MEMBER_CLOSE_CLICK: "add_member_close_click",
  ADD_MEMBER_GO_BACK_CLICK: "add_member_go_back_click",
  ADD_MEMBER_CONFIRM_CLICK: "add_member_confirm_click",
  MEMBER_OPTIONS_CLICK: "member_options_click",
  DELETE_MEMBER_CLICK: "delete_member_click",
  DELETE_MEMBER_CLOSE_CLICK: "delete_member_close_click",
  DELETE_MEMBER_CONFIRM_CLICK: "delete_member_confirm_click",

  // Self-serve account change. The email and phone flows share every screen past the profile
  // page, so the sheet names each moment twice - the pairing lives in ACCOUNT_CHANGE_EVENTS.
  EMAIL_UPDATE_CHANGE_LINK_CLICKED: "email_update_change_link_clicked",
  EMAIL_UPDATE_STEP1_VIEWED: "email_update_step1_viewed",
  EMAIL_UPDATE_SEND_OTP_CLICKED: "email_update_send_otp_clicked",
  EMAIL_UPDATE_DIGILOCKER_FALLBACK_CLICKED: "email_update_digilocker_fallback_clicked",
  EMAIL_UPDATE_MODAL_DISMISSED: "email_update_modal_dismissed",
  EMAIL_UPDATE_STEP2_VIEWED: "email_update_step2_viewed",
  EMAIL_UPDATE_OTP_SUBMITTED: "email_update_otp_submitted",
  EMAIL_UPDATE_RESEND_OTP_CLICKED: "email_update_resend_otp_clicked",
  EMAIL_UPDATE_OTP_INVALID_CODE_SHOWN: "email_update_otp_invalid_code_shown",
  EMAIL_UPDATE_OTP_LIMIT_BREACHED_VIEWED: "email_update_otp_limit_breached_viewed",
  EMAIL_UPDATE_RELOGIN_CTA_CLICKED: "email_update_relogin_cta_clicked",
  EMAIL_UPDATE_STEP3_VIEWED: "email_update_step3_viewed",
  EMAIL_UPDATE_NEW_EMAIL_SEND_OTP_CLICKED: "email_update_new_email_send_otp_clicked",
  EMAIL_UPDATE_INVALID_EMAIL_SHOWN: "email_update_invalid_email_shown",
  EMAIL_UPDATE_EMAIL_IN_USE_SHOWN: "email_update_email_in_use_shown",
  EMAIL_UPDATE_SECONDARY_MATCH_ALERT_VIEWED: "email_update_secondary_match_alert_viewed",
  EMAIL_UPDATE_SECONDARY_MATCH_CHOICE_MADE: "email_update_secondary_match_choice_made",
  EMAIL_UPDATE_OTP_GENERATION_FAILED_SHOWN: "email_update_otp_generation_failed_shown",
  EMAIL_UPDATE_STEP4_VIEWED: "email_update_step4_viewed",
  EMAIL_UPDATE_EDIT_VALUE_CLICKED: "email_update_edit_value_clicked",
  EMAIL_UPDATE_SUCCESS_VIEWED: "email_update_success_viewed",
  EMAIL_UPDATE_SUCCESS_CTA_CLICKED: "email_update_success_cta_clicked",

  PHONE_UPDATE_CHANGE_LINK_CLICKED: "phone_update_change_link_clicked",
  PHONE_UPDATE_STEP1_VIEWED: "phone_update_step1_viewed",
  PHONE_UPDATE_SEND_OTP_CLICKED: "phone_update_send_otp_clicked",
  PHONE_UPDATE_DIGILOCKER_FALLBACK_CLICKED: "phone_update_digilocker_fallback_clicked",
  PHONE_UPDATE_MODAL_DISMISSED: "phone_update_modal_dismissed",
  PHONE_UPDATE_STEP2_VIEWED: "phone_update_step2_viewed",
  PHONE_UPDATE_OTP_SUBMITTED: "phone_update_otp_submitted",
  PHONE_UPDATE_RESEND_OTP_CLICKED: "phone_update_resend_otp_clicked",
  PHONE_UPDATE_OTP_INVALID_CODE_SHOWN: "phone_update_otp_invalid_code_shown",
  PHONE_UPDATE_OTP_LIMIT_BREACHED_VIEWED: "phone_update_otp_limit_breached_viewed",
  PHONE_UPDATE_RELOGIN_CTA_CLICKED: "phone_update_relogin_cta_clicked",
  PHONE_UPDATE_STEP3_VIEWED: "phone_update_step3_viewed",
  PHONE_UPDATE_NEW_NUMBER_SEND_OTP_CLICKED: "phone_update_new_number_send_otp_clicked",
  PHONE_UPDATE_INVALID_NUMBER_SHOWN: "phone_update_invalid_number_shown",
  PHONE_UPDATE_NUMBER_IN_USE_SHOWN: "phone_update_number_in_use_shown",
  PHONE_UPDATE_SECONDARY_MATCH_ALERT_VIEWED: "phone_update_secondary_match_alert_viewed",
  PHONE_UPDATE_SECONDARY_MATCH_CHOICE_MADE: "phone_update_secondary_match_choice_made",
  PHONE_UPDATE_OTP_GENERATION_FAILED_SHOWN: "phone_update_otp_generation_failed_shown",
  PHONE_UPDATE_STEP4_VIEWED: "phone_update_step4_viewed",
  PHONE_UPDATE_EDIT_VALUE_CLICKED: "phone_update_edit_value_clicked",
  PHONE_UPDATE_SUCCESS_VIEWED: "phone_update_success_viewed",
  PHONE_UPDATE_SUCCESS_CTA_CLICKED: "phone_update_success_cta_clicked",

  // Boundary event: the same handoff out of Skydo's own screens for either flow, so it is named
  // once and carries source_flow instead of being split in two.
  DIGILOCKER_VERIFICATION_INITIATED: "digilocker_verification_initiated",

  // Create Invoice Events
  CREATE_INVOICE_CLICKED: "create_invoice_clicked",
  INVOICE_SECTION_EDIT_CLICKED: "invoice_section_edit_clicked",
  DOWNLOAD_DRAFT_INVOICE: "download_draft_invoice",
  FINALIZE_INVOICE_OUTER_CLICKED: "finalize_invoice_clicked",
  INVOICE_BANK_DETAILS_SELECTED: "invoice_bank_details_selected",
  VIEW_DRAFT_INVOICE_CLICKED: "view_draft_invoice_clicked",
  INVOICE_ITEMS_DISCOUNT_CLICKED: "invoice_items_discount_clicked",
  INVOICE_NUMBER_FOCUS: "invoice_number_focus",
  FINALIZE_INVOICE_POPUP_CLOSE: "finalize_invoice_popup_close",
  FINALIZE_INVOICE_POPUP_CONFIRM: "finalize_invoice_popup_confirm",
  FINALIZE_SUCCESS_POPUP_CLOSE: "finalize_success_popup_close",
  DOWNLOAD_INVOICE: "download_invoice",
  PAID_OUTSIDE_CTA_CLICKED: "paid_outside_cta_clicked",
  PAID_OUTSIDE_DATE_CHANGE: "paid_outside_date_change",
  PAID_OUTSIDE_AMOUNT_FOCUS: "paid_outside_amount_focus",
  PAID_OUTSIDE_CONFIRM: "paid_outside_confirm",
  PAID_OUTSIDE_CLOSE: "paid_outside_close",
  EMAIL_REMIND_CTA_CLICKED: "email_remind_cta_clicked",
  INVOICE_SECTION_SAVE_CLICKED: "invoice_section_save_clicked",
  INVOICE_ITEM_DISCOUNT_FOCUS: "invoice_item_discount_focus",
  INVOICE_DUE_DATE_CHANGE: "invoice_due_date_change",
  INVOICE_PAYMENT_TERMS_CHANGE: "invoice_payment_terms_change",
  DELETE_INVOICE_CTA_CLICKED: "delete_invoice_cta_clicked",
  EMAIL_INVOICE: "email_invoice",
  INVOICE_DROPDOWN_CHANGE: "invoice_dropdown_change",
  INVOICE_INPUT_FOCUS: "invoice_input_focus",
  INVOICE_EMAIL_SENT: "invoice_email_sent",
  INVOICE_EMAIL_TEST_EMAIL_SECTION_CLICK: "invoice_email_test_section_click",
  INVOICE_EMAIL_TEST_TO_FOCUS: "invoice_email_test_to_focus",
  INVOICE_EMAIL_TEST_SEND_CLICK: "invoice_email_test_send_click",
  INVOICE_EMAIL_TO_FOCUS: "invoice_email_to_focus",
  INVOICE_EMAIL_CC_FOCUS: "invoice_email_cc_focus",
  INVOICE_EMAIL_BCC_FOCUS: "invoice_email_bcc_focus",
  INVOICE_EMAIL_SEND_CLICK: "invoice_email_send_click",
  INVOICE_MARK_AS_SENT: "invoice_mark_as_sent",

  CURRENCY_LIST_OPEN: "currency_list_open",
  CURRENCY_LIST_CLOSE: "currency_list_close",
  CURRENCY_LIST_FOCUS: "currency_list_focus",

  BANK_HOLIDAYS_CTA_CLICK: "bank_holidays_cta_click",
  TRACK_EMAIL_CTA_CLICK: "track_email_cta_click",

  BULK_DOWNLOAD_BUTTON_CLICK: "bulk_download_button_click",

  DOWNLOAD_REDIRECT_SHOWN: "download_redirect_shown",
  DOWNLOAD_REDIRECT_CTA_CLICK: "download_redirect_cta_click",
  ROW_LEVEL_INVOICE_DOWNLOAD_CLICK: "row_level_invoice_download_click",
  REPORTS_TAB_VISITED: "reports_tab_visited",
  REPORTS_FILTERS_DROPDOWN_CLICK: "reports_filters_dropdown_click",
  REPORTS_FILTERS_APPLIED: "reports_filters_applied",
  REPORTS_DOWNLOAD_CLICK: "reports_download_click",
  REPORTS_DOWNLOAD_ASYNC_TRIGGERED: "reports_download_async_triggered",

  ONBOARDING_DOCS_LETUSKNOW: "onboarding_documents_letusknow",

  //   SENDER ALERT DOC UPLOAD EVENTS
  TM_UPLOAD_DOCUMENT_CLICKED: "tm_upload_document_clicked",
  TM_POPUP_SHOWN: "tm_popup_shown",
  TM_VIEW_SAMPLE_CLICKED: "tm_view_sample_clicked",
  TM_WHERE_TO_FIND_THIS_CLICKED: "tm_where_to_find_this_clicked",
  TM_BROWSE_DOCUMENT_CLICKED: "tm_browse_document_clicked",
  TM_DOCUMENT_UPLOADED: "tm_document_uploaded",
  TM_DOCUMENT_DELETED: "tm_document_deleted",
  TM_DOCUMENT_SUBMITTED: "tm_document_submitted",

  NOTIFICATION_ICON_CLICKED: "notification_icon_clicked",
  NOTIFICATION_CLICKED: "notification_clicked",
  NOTIFICATION_WIDGET_EXITED: "notification_widget_exited",
  NOTIFICATION_WIDGET_CLICKED: "notification_widget_clicked",

  NAVBAR_COLLAPSE_CLICK: "navbar_collapse_click",
  SKYDO_BALANCE_SIDE_BAR_CLICK: "skydo_balance_side_bar_click",

  //Recurring invoice events
  RECURRING_INVOICE_CHECKBOX_ENABLE: "recurring_invoice_checkbox_enable",
  RECURRING_INVOICE_CHECKBOX_DISABLE: "recurring_invoice_checkbox_disable",
  RECURRING_INVOICE_FREQUENCY_CHANGE: "recurring_invoice_frequency_change",
  RECURRING_INVOICE_STOP_CTA_CLICK: "recurring_invoice_stop_cta_click",
  RECURRING_INVOICE_STOP_CONFIRM: "recurring_invoice_stop_confirm",
  RECURRING_INVOICE_STOP_POPUP_SHOWN: "recurring_invoice_stop_popup_shown",

  INVOICE_MOBILE_EMAIL_SUBMIT: "invoice_mobile_email_submit",

  // walk through events
  WALKTHROUGH_START_POPUP_LOAD: "walkthrough_start_popup_load",
  WALKTHROUGH_START_POPUP_CONFIRM: "walkthrough_start_popup_confirm",
  WALKTHROUGH_STEP_1_VIEWED: "walkthrough_step_1_viewed",
  WALKTHROUGH_STEP_2_VIEWED: "walkthrough_step_2_viewed",
  WALKTHROUGH_STEP_3_VIEWED: "walkthrough_step_3_viewed",
  WALKTHROUGH_STEP_4_VIEWED: "walkthrough_step_4_viewed",
  WALKTHROUGH_STEP_5_VIEWED: "walkthrough_step_5_viewed",
  WALKTHROUGH_STEP_1_CLICKED: "walkthrough_step_1_clicked",
  WALKTHROUGH_STEP_2_CLICKED: "walkthrough_step_2_clicked_next",
  WALKTHROUGH_STEP_3_CLICKED: "walkthrough_step_3_clicked",
  WALKTHROUGH_STEP_4_CLICKED: "walkthrough_step_4_clicked",
  WALKTHROUGH_PREVIOUS_CLICKED: "walkthrough_previous_clicked",
  WALKTHROUGH_EXIT_CLICKED: "walkthrough_exit_clicked",
  WALKTHROUGH_FINISH_POPUP: "walkthrough_finish_popup_load",
  WALKTHROUGH_FINISH_POPUP_CTA_CLICKED: "walkthrough_finish_popup_cta_clicked",
  WALKTHROUGH_DONE_CLICKED: "walkthrough_done_clicked",
  CONTINUE_WALKTHROUGH_CLICKED: "continue_walkthrough_clicked",
  INDUSTRY_SELECTION: "industry_selection",
  INDUSTRY_SEARCH_CHANGE: "industry_search_change",
  NON_SKYDO_INVOICE_DUPLICATION_REQUEST: "non_skydo_invoice_duplication_request",
  NON_SKYDO_INVOICE_EDIT_REQUEST: "non_skydo_invoice_edit_request",
  SKYDO_INVOICE_DUPLICATION_REQUEST: "skydo_invoice_duplication_request",
  SKYDO_INVOICE_EDIT_REQUEST: "skydo_invoice_edit_request",

  FILE_UPLOAD_CLICK: "file_upload_click",
  FILE_UPLOAD_POPUP_LOAD: "file_upload_popup_load",

  MARK_AS_PAID_CLICKED: "mark_as_paid_clicked",
  MARK_AS_PAID_POPUP_SHOWN: "mark_as_paid_popup_shown",
  MARK_AS_PAID_REASON_SELECTED: "mark_as_paid_reason_selected",
  MARK_AS_PAID_CONFIRMED: "mark_as_paid_confirmed",
  MARK_AS_PAID_ABANDONED: "mark_as_paid_abandoned",

  ZOHO: {
    SKIP_POP_UP_OPEN: "skipzoho_popup_shown",
    SKIP_POP_UP_OPTION_CHOSEN: "skipzoho_popup_option_chosen",
    SKIP_POP_UP_CONFIRM: "skipzoho_popup_option_confirmed",
    SKIP_POP_UP_CANCEL: "skipzoho_popup_option_cancelled",
    CONNECT_POP_UP_OPEN: "zoho_connect_popup_shown",
    SELECT_ORG_POP_UP_OPEN: "zoho_choose_org_popup_shown",
    SELECT_ORG_POP_UP_CONFIRM: "zoho_choose_org_popup_confirmed",
    SELECT_ORG_POP_UP_CANCEL: "zoho_choose_org_popup_cancelled",

    CONNECTION_SUCCESSFUL: "zoho_connection_successful",
    CONNECTION_FAIL: "zoho_connection_failed",

    RETRY_CONNECTION_CLICK: "zoho_retry_connection_clicked",

    DISCONNECT_POP_UP_SHOW: "zoho_disconnect_popup_shown",
    DISCONNECT_POP_UP_CONFIRM: "zoho_disconnect_confirmed",
    DISCONNECT_POP_UP_CANCEL: "zoho_disconnect_cancelled",
    SETTINGS_POP_UP_SHOW: "zoho_settings_popup_shown",

    CONNECT_CLICKED: "zoho_connect_clicked",
    CROSS_CLICKED: "zoho_cross_clicked",
    IMPORT_FROM_ZOHO_CLICKED: "import_from_zoho_clicked",
    CONNECT_SECURELY_CLICKED: "zoho_connect_securely_clicked",
    UPDATE_SETTINGS_CLICKED: "zoho_update_settings_clicked",
    LET_US_KNOW_CLICKED: "zoho_let_us_know_clicked",
    SETTINGS_CHANGED: "zoho_settings_changed",
    DISCONNECT_CLICKED: "zoho_disconnect_clicked",
    BANNER_SHOWN: "zoho_banner_shown",
  },
  BANK_DETAILS_CHANGE_CLICK: "bank_details_change_click",
  BANK_ACCOUNT_EDIT: "bank_account_edit",
  BANK_DETAILS_CHANGE_VERIFY: "bank_details_change_verify",
  BANK_DETAILS_CHANGE_MAIL_BUTTON: "bank_details_change_mail_button",
  BANK_DETAILS_POP_UP_CLOSED: "bank_details_pop_up_closed",

  PAYPAL: {
    BANNER_CLICKED: "paypal_banner_clicked",
    PROFILE_CARD_PAYMENTS_LINK_CLICKED: "profile_card_payment_link_clicked",
    PAYMENT_LINKS_PAGE_SHOWN: "payment_links_page_shown",
    CONNECT_WITH_PAYPAL_BUTTON_CLICKED: "connect_with_paypal_button_clicked",
    PAYPAL_STANDARD_PRICING_TEXT_CLICK: "paypal_standard_pricing_text-click",
    CREATE_PAYMENT_LINK_CTA_CLICKED: "create_payment_link_cta_clicked",
    PAYMENT_LINK_CREATED_SUCCESSFULLY: "created_payment_link_successfully",
    PAYMENT_LINK_COPIED: "payment_link_copied",
    PAYER_PAGE_LOADED: "payer_page_loaded",
    CONNECT_WITH_PPRO_BUTTON_CLICK: "connect_with_ppro_button_click",
    PPRO_WEBSITE_REQUIRED_POPUP_OPEN: "ppro_trustly_website_popup_open",
    PPRO_WEBSITE_REQUIRED_POPUP_CLOSE: "ppro_trustly_website_popup_close",
    PPRO_WEBSITE_REQUIRED_POPUP_SUBMIT_REQUEST: "ppro_trustly_website_popup_submit_request",
    PAYER_CTA_CLICK: "payer_cta_click",
    PAYER_ACCOUNT_CONNECTED: "payer_account_connected",
    PAYER_TNC_CLICK: "payer_tnc_click",
    PAYER_AUTHORIZE_CLICK: "payer_authorize_click",
    PAYER_PAGE_STATUS_CHANGE: "payer_page_status_change",
    PAYMENT_LINK_VIDEO_WATCHED: "payment_link_video_watched",
    PAYMENT_LINK_PAYERXP_VIDEO_WATCHED: "payment_link_payerxp_video_watched",
    INSTALINKS_SIDE_BAR_CLICKED: "instalinks_side_bar_clicked",
    INSTALINK_PASSED_ON_FEES_CLICKED: "passed_on_fees",
    INSTALINK_PASSED_ON_FEES_REMOVED: "remove_fees",
    PREVIEW_AND_ADD_LOGO_CLICKED: "instalinks_preview_addlogo_clicked",
    INSTALINKS_PAGE_BANNER_SHOWN: "instalinks_page_banner_shown",
    INSTALINKS_PAGE_BANNER_CLICKED: "instalinks_page_banner_clicked",
    INSTALINKS_PAYER_CARD_ADDED: "payer_card_added",
    INSTALINKS_POPUP_RELOAD: "instalinks_popup_reload",
    PAYER_CHOOSE_PAYMENT_METHOD: "payer_choose_payment_method",
    INSTALINKS_EARLY_ACCESS_REQUESTED: "requested_instalink_access",
    VIEW_DETAILS_PAYMENT_LINK: "view_details_payment_link",
    DELETE_PAYMENT_LINK: "delete_payment_link",
    DELETE_PAYMENT_LINK_POPUP: "delete_payment_link_popup",
    CANCEL_PAYMENT_LINK_POPUP: "cancel_payment_link_popup",
  },

  TAG_MANAGER_EVENT: {
    SIGN_UP_SUCCESS: "SIGN_UP_SUCCESS",
    ENTER_COMPANY_PAN: "ENTER_COMPANY_PAN",
    ENTER_COMPANY_PAN_WITH_COMPANY_TYPE: "ENTER_COMPANY_PAN_WITH_COMPANY_TYPE",
    SOLE_PROP_WITH_GST_PAN_TRIGGER: "SOLE_PROP_WITH_GST_PAN_TRIGGER",
    COMPANY_PAN_DETAILS_SUBMIT: "CUSTOMER_PAN_DETAILS",
    VIRTUAL_ACCOUNT_CREATE: "VIRTUAL_ACCOUNT_CREATE",
    QUALIFIED_ONBOARDING_DONE: "Qualified_OB",
    ONBOARDING_DONE: "OB_Done",
    TECHNOLOGY_COMPANY_PAN_DETAILS_SUBMIT: "TECHNOLOGY_COMPANY_PAN_DETAILS_SUBMIT",
    CORRECT_USE_CASE_COMPANY_PAN_DETAILS_SUBMIT: "CORRECT_USE_CASE_COMPANY_PAN_DETAILS_SUBMIT",
    IDEAL_CUSTOMER_COMPANY_PAN_DETAILS_SUBMIT: "IDEAL_CUSTOMER_COMPANY_PAN_DETAILS_SUBMIT",
    IDEAL_CUSTOMER_COMPANY_PAN_DETAILS_SUBMIT_V2: "IDEAL_CUSTOMER_COMPANY_PAN_DETAILS_SUBMIT_V2",
    AMAZON_SELLER_COMPANY_OR_GST_PAN_SUBMIT: "AMAZON_SELLER_COMPANY_OR_GST_PAN_SUBMIT",
    LEAD_NBA: "LEAD_NBA",
    LEAD_ICP_SUBMIT_V2: "LEAD_ICP_SUBMIT_V2",
    LEAD_COMPANY: "Lead_company",
    LEAD_COMPANY_PAN_DETAILS_SUBMIT_V3: "LEAD_COMPANY_PAN_DETAILS_SUBMIT_V3",
    LEAD_ATS_MANUAL: "LEAD_ATS_MANUAL",
    LEAD_AMAZON_GLOBAL_SELLER: "LEAD_AMAZON_GLOBAL_SELLER",
    ICP_LEAD_V2: "ICP_LEAD_V2",
    MCG_LEAD: "MCG_LEAD",
    LEADCARD: "LEAD_CARD",
  },
  VKYC_POPUP_OPEN: "VKYC_POPUP_OPEN",
  VKYC_START_CLICK: "VKYC_START_CLICK",
  VKYC_POPUP_CLOSE: "VKYC_POPUP_CLOSE",
  DIGILOCKER_AADHAAR_VERIFIED: "DIGILOCKER_AADHAAR_VERIFIED",
  DIGILOCKER_AADHAAR_FAILED: "DIGILOCKER_AADHAAR_FAILED",
  PROFILE_CARD_PAYMENTS_LINK_CLICK: "profile_card_payments_link_click",
  WHATSAPP_CONSENT_CLICK: "whatsapp_consent_click",
  CALENDLY_EVENT_SCHEDULED: "calendly_event_scheduled",
  CALENDLY_PROFILE_PAGE_VIEW: "calendly_profile_page_view",
  CALENDLY_DATE_TIME_SELECTED: "calendly_date_time_selected",
  CALENDLY_EVENT_TYPE_VIEWED: "calendly_event_type_viewed",
  VKYC_QR_PAGE_VIEW: "vkyc_qr_page_view",

  ANALYTICS: {
    CURRENCY_DROP_DOWN_CLICK: "analytics_currency_dropdown_click",
    DURATION_DROP_DOWN_CLICK: "analytics_duration_dropdown_click",
    GROUPING_CLICK: "analytics_grouping_click",
    REVENUE_GRAPH_CLICK: "analytics_revenue_graph_click",
    CLIENT_GRAPH_CLICK: "analytics_client_graph_click",
  },
  DOWNLOAD_VIRTUAL_DOC_CLICK: "download_virtual_doc_click",
  DOWNLOAD_VENDOR_BANK_STATEMENT: "download_vendor_bank_statement",

  ACTIVATION_BANNER: "incentive_banner_shown",

  INTERNATIONAL_ACCOUNTS: {
    TEST_EMAIL_SECTION_CLICK: "international_accounts_test_email_section_click",
    TEST_TO_FOCUS: "international_accounts_test_to_focus",
    TEST_SEND_CLICK: "international_accounts_test_send_click",
    TO_FOCUS: "international_accounts_to_focus",
    CC_FOCUS: "international_accounts_cc_focus",
    BCC_FOCUS: "international_accounts_bcc_focus",
    SEND_CLICK: "international_accounts_send_click",
    LOCATION_SELECT: "international_accounts_location_select",
    CLOSE_POPUP: "international_accounts_close_popup",
    SHARE_VIA_EMAIL_FAILED: "share_via_email_failed",
    SHARE_POPUP_LOAD: "share_popup_load",
  },

  FOCUSED_HOME: {
    START_REC_PAYMENTS: "start_receiving_payment ",
    VKYC_STATE: "initiate_vkyc_state",
    TT_STATE: "initiate_test_transaction_state",
    INT_ACC_STATE: "initiate_accounts_state",
    INV_STATE: "initiate_invoice_state",
    CLICK_KNOW_MORE_PRICING: "click_fee_know_more_clicked",
    VIEW_INSTRUCTIONS: "view_instructions_clicked",
    CHOOSE_CURRENCY: "choose_withdrawl_currency",
    INT_CONTINUE: "international_accounts_step_continue",
    INT_QUESTION: "international_account_step_question_clicked",
    FOCUSED_HOME_LINK_CLICKED: "focused_home_link_clicked",
    GO_TO_INVOICE_CLICKED: "focused_home_go_to_invoice_clicked",
    PAYMENT_METHOD_STATE: "initiate_payment_method_state",
    PAYMENT_DETAIL_STATE: "initiate_payment_detail_state",

    INTENT_PAGE_VIEWED: "fh_intent_page_viewed",
    CHATBOT_WIDGET_SHOWN: "chatbot_widget_shown",
    CHATBOT_WIDGET_LOAD_FAILED: "chatbot_widget_load_failed",
    INTENT_CTA_NO_CLICKED: "fh_intent_cta_no_clicked",
    MORE_Q_FORM_OPENED: "more_q_form_opened",
    CHATBOT_OPENED: "chatbot_opened",
    MORE_Q_FORM_TEXT_INPUT_FOCUSED: "more_q_form_text_input_focused",
    MORE_Q_FORM_CALLBACK_REQUESTED: "more_q_form_callback_requested",
    MORE_Q_FORM_SUBMIT_CLICKED: "more_q_form_submit_clicked",
    INTENT_CTA_YES_CLICKED: "fh_intent_cta_yes_clicked",
    NEXT_PAYMENT_DETAIL_POPUP_OPENED: "timeline_popup_shown",
    TIMELINE_OPTION_SELECTED: "timeline_option_selected",
    TIMELINE_POPUP_BACK_CLICKED: "timeline_popup_back_clicked",
    TIMELINE_POPUP_SUBMITTED: "timeline_popup_submitted",
    TIMELINE_POPUP_CLOSED: "timeline_popup_closed",
    FAQ_BLOCK_SEEN: "fh_intent_faq_block_seen",
    FAQ_EXPAND: "fh_intent_faq_expand",
    BREADCRUMB_CLICKED: "fh_intent_breadcrumb_clicked",
    RECEIVE_INSTALINKS_CREATE_LINK_CLICKED: "fh_receive_instalinks_create_link_clicked",
    RECEIVE_INSTALINKS_FINAL_STEP_SHOWN: "fh_receive_instalinks_final_step_shown",
    COPY_ACCOUNT_DETAILS_CLICKED: "copy_ac_details_clicked",
    SHARE_ACCOUNT_DETAILS_CLICKED: "fh_receive_share_account_details_clicked",
    PLATFORM_CLICKED: "platform_clicked",
    COMPARE_LINK_OPENED: "compare_link_opened",
    FAQ_COLLAPSE: "fh_intent_faq_collapse",
    PRICING_FAQ_CTA_CLICKED: "fh_pricing_faq_cta_clicked",
    CURRENCY_SELECTED: "currency_selected",
    COUNTRY_SELECTED: "country_selected",
    CURRENCY_DROPDOWN_CLICKED: "currency_dropdown_clicked",
    COUNTRY_DROPDOWN_CLICKED: "country_dropdown_clicked",
    CHANGE_METHOD_CLICKED: "method_change_clicked",
    METHOD_CONTINUE_CLICKED: "method_continue_clicked",
    METHOD_SELECTED: "fh_receive_payment_method_selected",
    METHOD_STEP_SHOWN: "fh_receive_payment_method_step_shown",
    FAQ_SAVINGS_INTERACTED: "faq_savings_interacted",
    FIRST_PAYMENT_VIEWED: "fh_receive_first_payment_viewed",
    IA_FINAL_STEP_SHOWN: "fh_receive_IA_final_step_shown",
    TESTIMONIAL_CARD_SEEN: "testimonial_card_seen",
    FAQ_SAVINGS_VALUE_SET: "faq_savings_value_set",
  },

  TT_FINISH: "tt_finished",
  CHANGE_EMAIL_SETTINGS: "change_email_settings_click",
  EMAIL_SETTINGS_CHANGED: "email_settings_changed",
  EMAIL_SETTINGS_SAVED: "email_settings_saved",
  PDF_GENERATED: "pdf_generated",
  MAX_SIZE_ERROR_FILE_UPLOAD: "max_size_error_file_upload",
  FILE_UPLOAD_WITHIN_LIMITS: "file_uploaded_within_limits",

  NPS_DISPLAYED: "nps_displayed",
  NPS_SEEN: "nps_seen",
  NPS_SCORE_SELECTED: "nps_score_selected",
  NPS_SUBMITTED: "nps_submitted",
  FIRA_POPUP_OPENED: "fira_popup_opened",
  FIRA_POPUP_CLOSED: "fira_popup_closed",
  REFERRAL_NPS_NUDGE_SHOWN: "referral_nps_nudge_shown",
  REFERRAL_NPS_RESPONSE_FILLED: "referral_nps_response_filled",

  VIEW_DETAIL_SAVINGS_BANNER: "view_detail_savings_banner",
  SAVINGS_SLIDER_CHANGE: "savings_slider_change",

  INVOICE_FUNDING_FAQ_CLICK: "invoice_funding_faq_click",

  // Funding timeline / Check payment status modal
  FUNDING_TIMELINE_ENTRY_CLICKED: "funding_timeline_entry_clicked",
  FUNDING_TIMELINE_MODAL_VIEWED: "funding_timeline_modal_viewed",
  FUNDING_TIMELINE_DATE_ENTERED: "funding_timeline_date_entered",
  FUNDING_TIMELINE_CURRENCY_SELECTED: "funding_timeline_currency_selected",
  FUNDING_TIMELINE_ACCOUNT_SELECTED: "funding_timeline_account_selected",
  FUNDING_TIMELINE_MODE_SELECTED: "funding_timeline_mode_selected",
  FUNDING_TIMELINE_UNSUPPORTED_MODE_SHOWN: "funding_timeline_unsupported_mode_shown",
  FUNDING_TIMELINE_RESULT_VIEWED: "funding_timeline_result_viewed",
  FUNDING_TIMELINE_BANK_HOLIDAY_TOOLTIP_VIEWED: "funding_timeline_bank_holiday_tooltip_viewed",
  FUNDING_TIMELINE_EDIT_CLICKED: "funding_timeline_edit_clicked",
  FUNDING_TIMELINE_SUPPORT_EMAIL_CLICKED: "funding_timeline_support_email_clicked",
  FUNDING_TIMELINE_MODAL_CLOSED: "funding_timeline_modal_closed",

  INVOICING_ITEM_RATE_WARNING_ON_LINE: "invoicing_item_rate_warning_on_line",
  INVOICING_ITEM_RATE_WARNING_POP_UP: "invoicing_item_rate_warning_pop_up",
  INVOICING_ITEM_RATE_WARNING_POP_UP_CLOSE: "invoicing_item_rate_warning_pop_up_close",
  INVOICE_CREATION_ERROR: "invoice_creation_error",
  INVOICE_UPLOAD_ERROR: "invoice_upload_error",
  INVOICING_GUIDELINES_CLICK: "invoicing_guideline_cta_click",
  INT_ACC_PAGE: {
    COUNTRY_SELECT: "international_accounts_country_select",
    COUNTRY_SELECT_CONTINUE: "international_accounts_country_select_continue_click",
    CURRENCY_SELECT: "international_accounts_currency_select",
    CONFIRM_CLICK: "international_accounts_confirm_button",
    GET_HELP_CLICK: "international_accounts_account_page_get_help_click",
    COPY_DETAILS: "international_accounts_account_page_copy_account_details_click",
    CURRENCY_PAGE_BACK_CLICK: "international_accounts_currency_page_back_click",
    PLATFORM_SELECT: "platform_select",
    LINK_PLATFORM: "link_your_platform_button_click",
    SAMPLE_TRACKER_CLICK: "view_sample_tracker_click",
    PLATFORM_RIGHT_NAV: "platform_arrow_right_click",
    PLATFORM_LEFT_NAV: "platform_arrow_left_click",
    GET_HELP_CONTACT_SUPPORT_CLICK: "international_accounts_account_page_get_help_contact_support_click",
    UAE_LOCAL_ACCOUNT_ACTIVATE_CLICK: "international_accounts_uae_local_account_activate_click",
    DO_NOT_CONVERT_TO_GBP_INFO_LINK_CLICK: "international_accounts_do_not_convert_to_gbp_info_link_click",
    DO_NOT_CONVERT_TO_GBP_INFO_POPUP_CLOSE: "international_accounts_do_not_convert_to_gbp_info_popup_close",
    SWIFT_CHARGES_LEARN_MORE_CLICK: "international_accounts_swift_charges_learn_more_click",
    SWIFT_CHARGES_LEARN_MORE_POPUP_CLOSE: "international_accounts_swift_charges_learn_more_popup_close",
    FEES_TAB_CLICKED: "intl_accounts_fees_tab_clicked",
    TIMELINE_TAB_CLICKED: "intl_accounts_timeline_tab_clicked",
    HOW_IT_WORKS_TAB_CLICKED: "intl_accounts_how_it_works_tab_clicked",
  },
  SGD_ACCOUNT_DISPLAYED: "sgd_account_displayed",

  // Milestone widget events
  MILESTONE_WIDGET_CLICKED: "milestone_widget_clicked",
  MILESTONE_POPUP_OPENED: "milestone_popup_open",
  MILESTONE_IMAGE_DOWNLOAD_CLICK: "milestone_image_download_click",
  MILESTONE_SHARE_CLICK: "milestone_share_click",
  MILESTONE_POPUP_CLOSED: "milestone_popup_closed",

  SOLE_PROP_FREELANCER_QUES_LOAD: "soleprop_freelancer_question_load",
  SOLE_PROP_DOC_CHOSEN: "soleprop_doc_chosen",
  SOLE_PROP_FREELANCER_QUESTION_SWITCH: "soleprop_freelancer_question_switch",
  SOLE_PROP_FREELANCER_QUESTION_PROCEED: "soleprop_freelancer_question_proceed",
  SOLE_PROP_FREELANCER_QUESTION_BUSINESS_NAME_FOCUS: "soleprop_freelancer_question_business_name_focus",
  SOLE_PROP_FREELANCER_QUESTION_COMMUNICATION_NAME_FOCUS: "soleprop_freelancer_question_communication_name_focus",
  SOLE_PROP_FREELANCER_QUESTION_ERROR_SHOWN: "soleprop_freelancer_question_error_shown",

  SHOW_NATIVE_ACCOUNT_SELECT: "show_native_account_select",
  SHOW_OLD_ACCOUNT_SELECT: "show_old_account_select",

  // UAE AED Pricing Popup Events
  UAE_AED_PRICING_POPUP_SHOWN: "uae_aed_pricing_popup_shown",
  UAE_AED_PRICING_POPUP_CLOSED: "uae_aed_pricing_popup_closed",

  BANK_STATEMENT_PASSWORD_PROMPTED: "bank_statement_password_prompted",
  BANK_STATEMENT_PASSWORD_ENTERED_INCORRECTLY: "bank_statement_password_entered_incorrectly",
  BANK_STATEMENT_UPLOAD_SUCCESSFUL: "bank_statement_upload_successful",
  BANK_STATEMENT_UPLOAD_FAILED: "bank_statement_upload_failed",
  BANK_STATEMENT_UPLOAD_VIEWED: "bank_statement_upload_viewed",
  BANK_STATEMENT_ANALYSIS_INITIATED: "bank_statement_analysis_initiated",
  BANK_STATEMENT_UPLOAD_INITIATED: "bank_statement_upload_initiated",
  BANK_STATEMENT_ANALYSIS_FAILED: "bank_statement_analysis_failed",
  BANK_STATEMENT_SELECTED: "bank_statement_selected",
  OTHER_DOCUMENT_SELECTED: "other_document_selected",
  BANK_STATEMENT_ANALYSIS_SUCCESSFUL: "bank_statement_analysis_successful",
  CHANGE_BANK_ACCOUNT_POPUP_OPENED: "change_bank_ac_clicked",
  CHANGE_BANK_ACCOUNT_POPUP_CLOSED: "change_bank_ac_popup_closed",
  CHANGE_BANK_ACCOUNT_CLICKED: "change_bank_ac_popup_ok_clicked",
  CHANGE_BANK_ACCOUNT_GO_BACK_PRESSED: "change_bank_ac_popup_goBack_clicked",

  BANK_DETAILS_FAILED: "bank_details_failed",
  BANK_NAME_MISMATCH_RECOVERABLE_SHOWN: "bank_name_mismatch_recoverable_shown",
  CHANGE_BUSINESS_NAME_CLICKED: "change_business_name_clicked",
  CHANGE_BUSINESS_NAME_POPUP_SHOWN: "change_business_name_popup_shown",
  CHANGE_BUSINESS_NAME_POPUP_GO_BACK_PRESSED: "change_business_name_popup_goBack_clicked",
  CHANGE_BUSINESS_NAME_POPUP_CLOSED: "change_business_name_popup_closed",
  CHANGE_BUSINESS_NAME_SAVE_CLICKED: "change_business_name_popup_save_clicked",
  BUSINESS_NAME_UPDATE_SUCCESS: "business_name_update_success",
  BUSINESS_NAME_UPDATE_FAILED: "business_name_update_failed",
  BANK_VERIFIED_AFTER_NAME_CHANGE: "bank_verified_after_name_change",
  BANK_NAME_MISMATCH_AFTER_NAME_CHANGE: "bank_name_mismatch_after_name_change",

  MOBILE_HOME: {
    FIRST_TIME_VISIT: "first_time_visit_post_onboarding",
    BANNER_VKYC_CLICKED: "vkyc_start_clicked",
    KNOW_MORE_TT: "mobile_banner_clicked_know_more_TT",
    DISCOVER_MORE: "mobile_banner_clicked_discover_more",
  },

  VIDEO_KYC_INITIATE_CLICK_BANNER: "vkyc_initiate_click_banner",
  VIDEO_KYC_BANNER_LOAD: "vkyc_banner_load",

  UAE_ACCOUNT_BANNER_CLICKED: "uae_account_banner_clicked",
  UAE_ACCOUNT_BANNER_DISMISSED: "uae_account_banner_dismissed",

  VKYC_COMPLETED: "vkyc_completed",
  VKYC_DECLARATION_SUBMITTED: "vkyc_declaration_submitted",
  VKYC_BACK_CLICKED: "vkyc_back_button_click",
  DOCUMENT_RESOLVE_ISSUE_BUTTON_CLICKED: "doc_verification_resolve_issue_clicked",
  DOCUMENT_STATUS_RESOLVE_ISSUE_POPUP_OPEN: "doc_verification_upload_modal_opened",
  DOCUMENT_UPLOADED_IN_PROFILE_SECTION: "doc_verification_doc_upload_successful",
  DOCUMENT_VERIFICATION_SECTION_VIEWED: "doc_verification_section_viewed",
  DOCUMENT_VERIFICATION_BANNER_CTA_CLICKED: "doc_verification_banner_cta_clicked",
  DOCUMENTS_VERIFICATION_BANNER_CLICKED: "doc_verification_banner_cta_clicked",
  DOCUMENTS_VERIFICATION_BANNER_SHOWN: "doc_verification_banner_shown",

  INSTA_LINK: {
    BANNER_VISIBLE: "insta_link_banner_show",
    KNOW_MORE_CLICK: "insta_link_know_more_click",
    SKIP_CLICK: "insta_click_skip_click",
  },

  IEC_VERIFICATION: {
    IEC_VERIFICATION_ATTEMPTED: "iec_verification_attempted",
    IEC_VERIFICATION_SUCCESS: "iec_verification_success",
    IEC_VERIFICATION_FAILURE: "iec_verification_failure",
    IEC_SUPPORT_CLICK: "iec_support_click",
    IEC_VIDEO_CLICK: "iec_video_click",
    IEC_CALL_SUPPORT_CLICK: "iec_call_support_click",
  },

  MOBILE_NAV_BAR: {
    OPEN: "mobile_nav_bar_open",
    CLOSE: "mobile_nav_bar_close",
    OPTION_SELECT: "mobile_nav_bar_option_select",
  },

  RECENT_PAYMENT_ACTION_MENU: {
    SHOW: "recent_payment_action_menu_show",
    HIDE: "recent_payment_action_menu_hide",
  },

  MAPPING: {
    UNMAPPED_PAYMENT_CARD_CLICK: "unmapped_payment_card_clicked",
    MAP_PAYMENT_BUTTON_CLICK: "map_payment_clicked",
    MAPPING_TAB_CHANGE: "mapping_tab_change",
    REVIEW_MISMATCH_SHOWN: "review_mismatch_shown",
    INVOICE_MAP_CONFIRM_CLICK: "invoice_map_confirm_click",
    VIEWED_UNMAPPED_PAYMENTS: "viewed_unmapped_payments",
    INVOICE_MAPPED_SUCCESS: "invoice_mapped_success",
  },

  VEEM: {
    POPUP_OPENED: "veem_card_popup_opened",
    POPUP_CLOSED: "veem_card_popup_closed",
    BOTTOMSHEET_OPENED: "veem_card_bottomsheet_opened",
    BOTTOMSHEET_CLOSED: "veem_card_bottomsheet_closed",
    SDK_LOADED: "veem_sdk_loaded",
    SDK_LOAD_FAILED: "veem_sdk_load_failed",
    PLUGIN_INITIALIZED: "veem_plugin_initialized",
    PLUGIN_INIT_FAILED: "veem_plugin_init_failed",
    POPUP_LOAD_FAILED: "veem_popup_load_failed",
    PLUGIN_LOAD_FAILED: "veem_plugin_load_failed",
  },

  INSTANT_SETTLEMENT: {
    SETTLE_CLICK: "settle_now_clicked",
    SETTLE_CONFIRM: "settle_now_confirm",
    FEEDBACK: {
      CLICK_CLOSE_FEEDBACK_POPUP: "instant_settlement_click_close_feedback_popup",
      FEEDBACK_SUBMISSION_FAILED: "instant_settlement_feedback_submission_failed",
      FEEDBACK_SUBMITTED_SUCCESSFULLY: "instant_settlement_feedback_submitted_successfully",
      FEEDBACK_SUBMIT_CLICKED: "instant_settlement_submit_clicked",
    },
    CLOSE: "instant_settlement_popup_close",
    /** GTM / marketing — FAQs link in instant settlement popup header */
    FAQ_LINK_CLICK: "instant_settlement_faq_click",
    PREVIEW_OPENED: "instant_settlement_preview_opened",
    PREVIEW_VIEWED: "instant_settlement_preview_viewed",
  },

  MOBILE_MAPPING_BANNER_LOAD: "mobile_mapping_banner_load",
  MOBILE_MAPPING_BANNER_CLOSE: "mobile_mapping_banner_close",

  // UAE Account Events
  UAE_ACCOUNT: {
    ACTIVATE_ACCOUNT_CLICK: "uae_activate_account_click", // properties: IA_variation (new_design / old_design)
    PRICING_CLICK: "uae_pricing_click",
    OPT_IN_POPUP_OPENED: "uae_opt_in_popup_opened",
    OPT_IN_POPUP_CLOSED: "uae_opt_in_popup_closed", // properties: type (cross, cancel_button, outside_click)
    OPT_IN_POPUP_NEXT_CLICK: "uae_opt_in_popup_next_click", // properties: expectedCurrency, estimatedMonthlyVolume, expectedPaymentTimeline
    PRICING_ACCEPTED: "uae_pricing_accepted",
    PRICING_POPUP_GO_BACK: "uae_pricing_popup_go_back",
    HOMEPAGE_BANNER_CLICK: "uae_homepage_banner_click",
    HOMEPAGE_BANNER_DISMISSED: "uae_homepage_banner_dismissed",
    FEEDBACK_BUTTON_CLICK: "uae_feedback_button_click", // properties: IA_variation (new_design / old_design)
    FEEDBACK_CANCEL: "uae_feedback_cancel",
    FEEDBACK_SUBMITTED: "uae_feedback_submitted", // properties: feedback object
    PASS_ON_FEE_FULL_SELECTED: "uae_pass_on_fee_full_selected",
    PASS_ON_FEE_BASE_SELECTED: "uae_pass_on_fee_base_selected",
    PASS_ON_FEE_REGIONAL_SELECTED: "uae_pass_on_fee_regional_selected",
  },

  // UAE Transfer Details (public payer page) – properties: location "public", invoiceId?, exporterId?, field? (for copy)
  UAE_TRANSFER_DETAILS_PAGE_LOAD: "uae_transfer_details_page_load",
  UAE_TRANSFER_VIEW_ACCOUNT_DETAILS_CLICK: "uae_transfer_view_account_details_click",
  UAE_TRANSFER_WHY_PAY_ACCORDION_CLICK: "uae_transfer_why_pay_accordion_click",
  UAE_TRANSFER_SWIFT_VS_LOCAL_ACCORDION_CLICK: "uae_transfer_swift_vs_local_accordion_click",
  UAE_TRANSFER_HOW_TO_PAY_ACCORDION_CLICK: "uae_transfer_how_to_pay_accordion_click",
  UAE_TRANSFER_INVOICE_LINK_CLICK: "uae_transfer_invoice_link_click",
  UAE_TRANSFER_COPY_CLICK: "uae_transfer_copy_click",

  /** Skydo Balance — NUX (new user experience), overview, payouts, withdrawals, TM */
  BALANCE_FLOW: {
    NUX_SCREEN_VIEWED: "balance_nux_screen_viewed",
    NUX_PRICING_VIEWED: "balance_nux_pricing_viewed",
    NUX_FAQ_SEEN: "balance_nux_faq_seen",
    PAGE_VIEWED: "balance_page_viewed",
    TERMS_CONDITIONS_CLICKED: "balance_terms_conditions_clicked",
    ACCOUNT_VIEWED: "balance_account_viewed",
    FAQ_CLICKED: "balance_faq_clicked",
    ACCOUNT_DETAILS_COPIED: "balance_account_details_copied",
    ACCOUNT_DETAILS_SHARED_EMAIL: "account_details_shared_email",
    MAKE_PAYOUT_CLICKED: "make_payout_clicked",
    OUTSIDE_US_BANNER_CTA_CLICKED: "balance_outside_us_banner_cta_clicked",
    OUTSIDE_US_BANNER_DISMISSED: "balance_outside_us_banner_dismissed",
    PAYOUT_INVOICE_BROWSE_CLICKED: "payout_invoice_browse_clicked",
    PAYOUT_INVOICE_UPLOADED: "payout_invoice_uploaded",
    PAYOUT_NO_INVOICE_REQUEST: "payout_no_invoice_request",
    PAYOUT_NO_INVOICE_REQUEST_REASON_SUBMITTED: "payout_no_invoice_request_reason_submitted",
    PAYOUT_DETAILS_FILLED: "payout_details_filled",
    PAYOUT_SUMMARY_VIEWED: "payout_summary_viewed",
    PAYOUT_SUMMARY_FINALISED: "payout_summary_finalised",
    PAYOUT_DIGILOCKER_STARTED: "payout_digilocker_started",
    PAYOUT_DIGILOCKER_FAILED: "payout_digilocker_failed",
    PAYOUT_INITIATED: "payout_initiated",
    PAYOUT_PROOF_DOWNLOADED: "payout_proof_downloaded",
    WITHDRAW_CLICKED: "withdraw_clicked",
    WITHDRAW_AMOUNT_ENTERED: "withdraw_amount_entered",
    WITHDRAW_INITIATED: "withdraw_initiated",
    TM_IN_PROGRESS_VIEWED: "balance_tm_in_progress_viewed",
    PAID_TO_DETAIL_VIEWED: "paid_to_detail_viewed",
    RECEIVED_PAYMENT_DETAIL_VIEWED: "received_payment_detail_viewed",
    INVOICE_DETAIL_VIEWED: "invoice_detail_viewed",
    FAQ_CLICK: "skydo_balance_page_view_more_faq",
  },

  OVD_COLLECTION: {
    LANDING_PAGE_VIEWED: "ovd_landing_page_viewed",
    VERIFICATION_STARTED: "ovd_verification_started",
    DOCUMENT_UPLOADED: "ovd_document_uploaded",
    DOCUMENT_SUBMIT_CLICKED: "ovd_document_submit_clicked",
    DOCUMENT_VALIDATION_RESULT: "ovd_document_validation_result",
    DIGILOCKER_VERIFIED: "ovd_digilocker_verified",
    DIGILOCKER_FAILURE: "ovd_digilocker_failure",
    SHARE_CLICKED: "ovd_share_clicked",
    SHARE_SENT: "ovd_share_sent",
  },

  SKYDO_FEES: {
    EMPTY_STATE_CTA_CLICKED: "skydo_fees_empty_state_cta_clicked",
    ACTIVE_STATE_LINK_CLICKED: "skydo_fees_active_state_link_clicked",
    PRICING_TOGGLE_SWITCHED: "skydo_fees_pricing_toggle_switched",
    INVOICE_DETAIL_LINK_CLICKED: "invoice_detail_skydo_fees_link_clicked",
  },

  AMAZON_PAYMENTS: {
    EMPTY_STATE_CTA_CLICKED: "amazon_payments_empty_state_cta_clicked",
    FAQ_TOGGLED: "amazon_payments_faq_toggled",
  },
};

export const PAGE_CATEGORY = {
  SMALL_SCREEN: "small_screen",
};

export const PAGE_NAMES = {
  MOBILE: "mobile",
};

export const BACKEND_EVENTS = {
  REFEREE_LANDED: "REFEREE_LANDED",
};
