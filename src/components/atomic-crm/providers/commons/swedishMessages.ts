import type { TranslationMessages } from "ra-core";
import type { raSupabaseEnglishMessages } from "ra-supabase-language-english";

export const swedishAdminMessages = {
  ra: {
    action: {
      add_filter: "Lägg till filter",
      add: "Lägg till",
      back: "Tillbaka",
      bulk_actions: "1 post vald |||| %{smart_count} poster valda",
      cancel: "Avbryt",
      clear_array_input: "Töm listan",
      clear_input_value: "Rensa värde",
      clone: "Duplicera",
      confirm: "Bekräfta",
      create: "Skapa",
      create_item: "Skapa %{item}",
      delete: "Ta bort",
      edit: "Redigera",
      export: "Exportera",
      list: "Lista",
      refresh: "Uppdatera",
      remove_filter: "Ta bort det här filtret",
      remove_all_filters: "Ta bort alla filter",
      remove: "Ta bort",
      reset: "Återställ",
      save: "Spara",
      search: "Sök",
      search_columns: "Sök bland kolumner",
      select_all: "Välj alla",
      select_all_button: "Välj alla",
      select_row: "Välj den här raden",
      show: "Visa",
      sort: "Sortera",
      undo: "Ångra",
      unselect: "Avmarkera",
      expand: "Expandera",
      close: "Stäng",
      open_menu: "Öppna meny",
      close_menu: "Stäng meny",
      update: "Uppdatera",
      move_up: "Flytta upp",
      move_down: "Flytta ner",
      open: "Öppna",
      toggle_theme: "Växla mellan ljust och mörkt tema",
      select_columns: "Kolumner",
      update_application: "Ladda om appen",
    },
    boolean: {
      true: "Ja",
      false: "Nej",
      null: " ",
    },
    page: {
      create: "Skapa %{name}",
      dashboard: "Översikt",
      edit: "%{name} %{recordRepresentation}",
      error: "Något gick fel",
      list: "%{name}",
      loading: "Läser in",
      not_found: "Hittades inte",
      show: "%{name} %{recordRepresentation}",
      empty: "Inga %{name} ännu.",
      invite: "Vill du lägga till en?",
      access_denied: "Åtkomst nekad",
      authentication_error: "Autentiseringsfel",
    },
    input: {
      file: {
        upload_several:
          "Släpp filer för att ladda upp, eller klicka för att välja en.",
        upload_single:
          "Släpp en fil för att ladda upp, eller klicka för att välja den.",
      },
      image: {
        upload_several:
          "Släpp bilder för att ladda upp, eller klicka för att välja en.",
        upload_single:
          "Släpp en bild för att ladda upp, eller klicka för att välja den.",
      },
      references: {
        all_missing: "Kunde inte hitta referensdata.",
        many_missing:
          "Minst en av de kopplade referenserna är inte längre tillgänglig.",
        single_missing: "Den kopplade referensen är inte längre tillgänglig.",
      },
      password: {
        toggle_visible: "Dölj lösenord",
        toggle_hidden: "Visa lösenord",
      },
    },
    message: {
      about: "Om",
      access_denied: "Du har inte behörighet att öppna den här sidan",
      are_you_sure: "Är du säker?",
      authentication_error:
        "Autentiseringsservern returnerade ett fel och dina inloggningsuppgifter kunde inte kontrolleras.",
      auth_error: "Ett fel uppstod vid validering av autentiseringstoken.",
      bulk_delete_content:
        "Vill du verkligen ta bort denna %{name}? |||| Vill du verkligen ta bort dessa %{smart_count} poster?",
      bulk_delete_title: "Ta bort %{name} |||| Ta bort %{smart_count} %{name}",
      bulk_update_content:
        "Vill du verkligen uppdatera %{name} %{recordRepresentation}? |||| Vill du verkligen uppdatera dessa %{smart_count} poster?",
      bulk_update_title:
        "Uppdatera %{name} %{recordRepresentation} |||| Uppdatera %{smart_count} %{name}",
      clear_array_input: "Vill du verkligen tömma hela listan?",
      delete_content: "Vill du verkligen ta bort denna %{name}?",
      delete_title: "Ta bort %{name} %{recordRepresentation}",
      details: "Detaljer",
      error: "Ett klientfel uppstod och din begäran kunde inte slutföras.",
      invalid_form: "Formuläret innehåller fel. Kontrollera fälten",
      loading: "Vänta",
      no: "Nej",
      not_found: "Du har angett en felaktig URL eller följt en ogiltig länk.",
      select_all_limit_reached:
        "Det finns för många poster för att välja alla. Endast de första %{max} posterna valdes.",
      unsaved_changes:
        "Vissa ändringar har inte sparats. Vill du verkligen ignorera dem?",
      yes: "Ja",
      placeholder_data_warning: "Nätverksproblem: Data kunde inte uppdateras.",
    },
    navigation: {
      clear_filters: "Rensa filter",
      no_filtered_results: "Inga %{name} hittades med de aktuella filtren.",
      no_results: "Inga %{name} hittades",
      no_more_results: "Sida %{page} finns inte. Prova föregående sida.",
      page_out_of_boundaries: "Sida %{page} finns inte",
      page_out_from_end: "Kan inte gå förbi sista sidan",
      page_out_from_begin: "Kan inte gå före sida 1",
      page_range_info: "%{offsetBegin}–%{offsetEnd} av %{total}",
      partial_page_range_info:
        "%{offsetBegin}–%{offsetEnd} av fler än %{offsetEnd}",
      current_page: "Sida %{page}",
      page: "Gå till sida %{page}",
      first: "Gå till första sidan",
      last: "Gå till sista sidan",
      next: "Gå till nästa sida",
      previous: "Gå till föregående sida",
      page_rows_per_page: "Rader per sida:",
      skip_nav: "Hoppa till innehåll",
    },
    sort: {
      sort_by: "Sortera efter %{field_lower_first} %{order}",
      ASC: "stigande",
      DESC: "fallande",
    },
    auth: {
      auth_check_error: "Logga in för att fortsätta",
      user_menu: "Profil",
      username: "Användarnamn",
      password: "Lösenord",
      email: "E-post",
      sign_in: "Logga in",
      sign_in_error: "Inloggningen misslyckades. Försök igen",
      logout: "Logga ut",
    },
    notification: {
      updated: "Post uppdaterad |||| %{smart_count} poster uppdaterade",
      created: "Post skapad",
      deleted: "Post borttagen |||| %{smart_count} poster borttagna",
      bad_item: "Ogiltig post",
      item_doesnt_exist: "Posten finns inte",
      http_error: "Fel vid kommunikation med servern",
      data_provider_error: "Fel i dataleverantören. Se konsolen för detaljer.",
      i18n_error: "Kan inte läsa in översättningarna för det valda språket",
      canceled: "Åtgärden avbröts",
      logged_out: "Din session har avslutats. Logga in igen.",
      not_authorized: "Du har inte behörighet att komma åt den här resursen.",
      application_update_available: "En ny version är tillgänglig.",
      offline: "Ingen nätverksanslutning. Kunde inte hämta data.",
    },
    validation: {
      required: "Obligatoriskt",
      minLength: "Måste innehålla minst %{min} tecken",
      maxLength: "Får innehålla högst %{max} tecken",
      minValue: "Måste vara minst %{min}",
      maxValue: "Får vara högst %{max}",
      number: "Måste vara ett tal",
      email: "Måste vara en giltig e-postadress",
      oneOf: "Måste vara ett av: %{options}",
      regex: "Måste följa formatet (reguljärt uttryck): %{pattern}",
      unique: "Måste vara unikt",
    },
    saved_queries: {
      label: "Sparade sökningar",
      query_name: "Söknamn",
      new_label: "Spara aktuell sökning...",
      new_dialog_title: "Spara aktuell sökning som",
      remove_label: "Ta bort sparad sökning",
      remove_label_with_name: "Ta bort sökningen ”%{name}”",
      remove_dialog_title: "Ta bort sparad sökning?",
      remove_message:
        "Vill du verkligen ta bort den här sökningen från listan över sparade sökningar?",
      help: "Filtrera listan och spara sökningen till senare",
    },
    configurable: {
      customize: "Anpassa",
      configureMode: "Anpassa den här sidan",
      inspector: {
        title: "Inspektör",
        content:
          "Håll pekaren över appens gränssnittselement för att anpassa dem",
        reset: "Återställ inställningar",
        hideAll: "Dölj alla",
        showAll: "Visa alla",
      },
      Datagrid: {
        title: "Datatabell",
        unlabeled: "Kolumn utan namn #%{column}",
      },
      SimpleForm: {
        title: "Formulär",
        unlabeled: "Fält utan namn #%{input}",
      },
      SimpleList: {
        title: "Lista",
        primaryText: "Primär text",
        secondaryText: "Sekundär text",
        tertiaryText: "Tertiär text",
      },
    },
  },
} satisfies TranslationMessages;

export const swedishSupabaseMessages = {
  "ra-supabase": {
    auth: {
      email: "E-post",
      confirm_password: "Bekräfta lösenord",
      sign_in_with: "Logga in med %{provider}",
      forgot_password: "Glömt lösenordet?",
      reset_password: "Återställ lösenord",
      password_reset:
        "Leta efter ett e-postmeddelande med en länk för att återställa ditt lösenord.",
      missing_tokens: "Åtkomsttoken och uppdateringstoken saknas",
      back_to_login: "Tillbaka till inloggning",
    },
    reset_password: {
      forgot_password: "Glömt lösenordet?",
      forgot_password_details:
        "Ange din e-postadress för att få instruktioner.",
    },
    set_password: {
      new_password: "Välj lösenord",
    },
    validation: {
      password_mismatch: "Lösenorden matchar inte",
    },
  },
} satisfies typeof raSupabaseEnglishMessages;
