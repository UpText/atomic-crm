import type { TranslationMessages } from "ra-core";
import type { raSupabaseEnglishMessages } from "ra-supabase-language-english";

export const danishAdminMessages = {
  ra: {
    action: {
      add_filter: "Tilføj filter",
      add: "Tilføj",
      back: "Tilbage",
      bulk_actions: "1 post valgt |||| %{smart_count} poster valgt",
      cancel: "Annuller",
      clear_array_input: "Ryd listen",
      clear_input_value: "Ryd værdi",
      clone: "Dupliker",
      confirm: "Bekræft",
      create: "Opret",
      create_item: "Opret %{item}",
      delete: "Slet",
      edit: "Rediger",
      export: "Eksporter",
      list: "Liste",
      refresh: "Opdater",
      remove_filter: "Fjern dette filter",
      remove_all_filters: "Fjern alle filtre",
      remove: "Fjern",
      reset: "Nulstil",
      save: "Gem",
      search: "Søg",
      search_columns: "Søg i kolonner",
      select_all: "Vælg alle",
      select_all_button: "Vælg alle",
      select_row: "Vælg denne række",
      show: "Vis",
      sort: "Sortér",
      undo: "Fortryd",
      unselect: "Fravælg",
      expand: "Udvid",
      close: "Luk",
      open_menu: "Åbn menu",
      close_menu: "Luk menu",
      update: "Opdater",
      move_up: "Flyt op",
      move_down: "Flyt ned",
      open: "Åbn",
      toggle_theme: "Skift mellem lyst og mørkt tema",
      select_columns: "Kolonner",
      update_application: "Genindlæs appen",
    },
    boolean: {
      true: "Ja",
      false: "Nej",
      null: " ",
    },
    page: {
      create: "Opret %{name}",
      dashboard: "Oversigt",
      edit: "%{name} %{recordRepresentation}",
      error: "Noget gik galt",
      list: "%{name}",
      loading: "Indlæser",
      not_found: "Ikke fundet",
      show: "%{name} %{recordRepresentation}",
      empty: "Ingen %{name} endnu.",
      invite: "Vil du tilføje en?",
      access_denied: "Adgang nægtet",
      authentication_error: "Godkendelsesfejl",
    },
    input: {
      file: {
        upload_several:
          "Slip filer for at uploade, eller klik for at vælge en.",
        upload_single:
          "Slip en fil for at uploade, eller klik for at vælge den.",
      },
      image: {
        upload_several:
          "Slip billeder for at uploade, eller klik for at vælge et.",
        upload_single:
          "Slip et billede for at uploade, eller klik for at vælge det.",
      },
      references: {
        all_missing: "Referencedata kunne ikke findes.",
        many_missing:
          "Mindst én af de tilknyttede referencer er ikke længere tilgængelig.",
        single_missing:
          "Den tilknyttede reference er ikke længere tilgængelig.",
      },
      password: {
        toggle_visible: "Skjul adgangskode",
        toggle_hidden: "Vis adgangskode",
      },
    },
    message: {
      about: "Om",
      access_denied: "Du har ikke tilladelse til at åbne denne side",
      are_you_sure: "Er du sikker?",
      authentication_error:
        "Godkendelsesserveren returnerede en fejl, og dine loginoplysninger kunne ikke kontrolleres.",
      auth_error: "Der opstod en fejl under validering af godkendelsestokenet.",
      bulk_delete_content:
        "Er du sikker på, at du vil slette denne %{name}? |||| Er du sikker på, at du vil slette disse %{smart_count} poster?",
      bulk_delete_title: "Slet %{name} |||| Slet %{smart_count} %{name}",
      bulk_update_content:
        "Er du sikker på, at du vil opdatere %{name} %{recordRepresentation}? |||| Er du sikker på, at du vil opdatere disse %{smart_count} poster?",
      bulk_update_title:
        "Opdater %{name} %{recordRepresentation} |||| Opdater %{smart_count} %{name}",
      clear_array_input: "Er du sikker på, at du vil rydde hele listen?",
      delete_content: "Er du sikker på, at du vil slette denne %{name}?",
      delete_title: "Slet %{name} %{recordRepresentation}",
      details: "Detaljer",
      error: "Der opstod en klientfejl, og din anmodning kunne ikke fuldføres.",
      invalid_form: "Formularen indeholder fejl. Kontrollér felterne",
      loading: "Vent venligst",
      no: "Nej",
      not_found:
        "Du har indtastet en forkert URL eller fulgt et ugyldigt link.",
      select_all_limit_reached:
        "Der er for mange poster til at vælge alle. Kun de første %{max} poster blev valgt.",
      unsaved_changes:
        "Nogle af dine ændringer blev ikke gemt. Er du sikker på, at du vil kassere dem?",
      yes: "Ja",
      placeholder_data_warning: "Netværksproblem: Data kunne ikke opdateres.",
    },
    navigation: {
      clear_filters: "Ryd filtre",
      no_filtered_results: "Ingen %{name} fundet med de aktuelle filtre.",
      no_results: "Ingen %{name} fundet",
      no_more_results: "Side %{page} findes ikke. Prøv den forrige side.",
      page_out_of_boundaries: "Side %{page} findes ikke",
      page_out_from_end: "Kan ikke gå forbi sidste side",
      page_out_from_begin: "Kan ikke gå før side 1",
      page_range_info: "%{offsetBegin}–%{offsetEnd} af %{total}",
      partial_page_range_info:
        "%{offsetBegin}–%{offsetEnd} af flere end %{offsetEnd}",
      current_page: "Side %{page}",
      page: "Gå til side %{page}",
      first: "Gå til første side",
      last: "Gå til sidste side",
      next: "Gå til næste side",
      previous: "Gå til forrige side",
      page_rows_per_page: "Rækker pr. side:",
      skip_nav: "Spring til indhold",
    },
    sort: {
      sort_by: "Sortér efter %{field_lower_first} %{order}",
      ASC: "stigende",
      DESC: "faldende",
    },
    auth: {
      auth_check_error: "Log ind for at fortsætte",
      user_menu: "Profil",
      username: "Brugernavn",
      password: "Adgangskode",
      email: "E-mail",
      sign_in: "Log ind",
      sign_in_error: "Login mislykkedes. Prøv igen",
      logout: "Log ud",
    },
    notification: {
      updated: "Post opdateret |||| %{smart_count} poster opdateret",
      created: "Post oprettet",
      deleted: "Post slettet |||| %{smart_count} poster slettet",
      bad_item: "Ugyldig post",
      item_doesnt_exist: "Posten findes ikke",
      http_error: "Fejl ved kommunikation med serveren",
      data_provider_error:
        "Fejl i dataleverandøren. Se konsollen for detaljer.",
      i18n_error: "Kan ikke indlæse oversættelserne for det valgte sprog",
      canceled: "Handlingen blev annulleret",
      logged_out: "Din session er udløbet. Log ind igen.",
      not_authorized: "Du har ikke adgang til denne ressource.",
      application_update_available: "En ny version er tilgængelig.",
      offline: "Ingen netværksforbindelse. Data kunne ikke hentes.",
    },
    validation: {
      required: "Påkrævet",
      minLength: "Skal indeholde mindst %{min} tegn",
      maxLength: "Må højst indeholde %{max} tegn",
      minValue: "Skal være mindst %{min}",
      maxValue: "Må højst være %{max}",
      number: "Skal være et tal",
      email: "Skal være en gyldig e-mailadresse",
      oneOf: "Skal være en af: %{options}",
      regex: "Skal følge formatet (regulært udtryk): %{pattern}",
      unique: "Skal være unik",
    },
    saved_queries: {
      label: "Gemte søgninger",
      query_name: "Søgenavn",
      new_label: "Gem aktuel søgning...",
      new_dialog_title: "Gem aktuel søgning som",
      remove_label: "Fjern gemt søgning",
      remove_label_with_name: "Fjern søgningen »%{name}«",
      remove_dialog_title: "Fjern gemt søgning?",
      remove_message:
        "Er du sikker på, at du vil fjerne denne søgning fra listen over gemte søgninger?",
      help: "Filtrer listen, og gem søgningen til senere",
    },
    configurable: {
      customize: "Tilpas",
      configureMode: "Tilpas denne side",
      inspector: {
        title: "Inspektør",
        content: "Hold markøren over appens elementer for at tilpasse dem",
        reset: "Nulstil indstillinger",
        hideAll: "Skjul alle",
        showAll: "Vis alle",
      },
      Datagrid: {
        title: "Datatabel",
        unlabeled: "Kolonne uden navn #%{column}",
      },
      SimpleForm: {
        title: "Formular",
        unlabeled: "Felt uden navn #%{input}",
      },
      SimpleList: {
        title: "Liste",
        primaryText: "Primær tekst",
        secondaryText: "Sekundær tekst",
        tertiaryText: "Tertiær tekst",
      },
    },
  },
} satisfies TranslationMessages;

export const danishSupabaseMessages = {
  "ra-supabase": {
    auth: {
      email: "E-mail",
      confirm_password: "Bekræft adgangskode",
      sign_in_with: "Log ind med %{provider}",
      forgot_password: "Glemt adgangskode?",
      reset_password: "Nulstil adgangskode",
      password_reset:
        "Se efter en e-mail med et link til at nulstille din adgangskode.",
      missing_tokens: "Adgangs- og opdateringstokens mangler",
      back_to_login: "Tilbage til login",
    },
    reset_password: {
      forgot_password: "Glemt adgangskode?",
      forgot_password_details:
        "Indtast din e-mailadresse for at få instruktioner.",
    },
    set_password: {
      new_password: "Vælg adgangskode",
    },
    validation: {
      password_mismatch: "Adgangskoderne er ikke ens",
    },
  },
} satisfies typeof raSupabaseEnglishMessages;
