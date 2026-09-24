import type { TranslationMessages } from "ra-core";
import type { raSupabaseEnglishMessages } from "ra-supabase-language-english";

export const nynorskAdminMessages = {
  ra: {
    action: {
      add_filter: "Legg til filter",
      add: "Legg til",
      back: "Tilbake",
      bulk_actions: "1 oppføring vald |||| %{smart_count} oppføringar valde",
      cancel: "Avbryt",
      clear_array_input: "Tøm lista",
      clear_input_value: "Tøm verdi",
      clone: "Dupliser",
      confirm: "Stadfest",
      create: "Opprett",
      create_item: "Opprett %{item}",
      delete: "Slett",
      edit: "Rediger",
      export: "Eksporter",
      list: "Liste",
      refresh: "Oppdater",
      remove_filter: "Fjern dette filteret",
      remove_all_filters: "Fjern alle filter",
      remove: "Fjern",
      reset: "Nullstill",
      save: "Lagre",
      search: "Søk",
      search_columns: "Søk i kolonnar",
      select_all: "Vel alle",
      select_all_button: "Vel alle",
      select_row: "Vel denne rada",
      show: "Vis",
      sort: "Sorter",
      undo: "Angre",
      unselect: "Fjern val",
      expand: "Utvid",
      close: "Lukk",
      open_menu: "Opne meny",
      close_menu: "Lukk meny",
      update: "Oppdater",
      move_up: "Flytt opp",
      move_down: "Flytt ned",
      open: "Opne",
      toggle_theme: "Byt mellom lyst og mørkt tema",
      select_columns: "Kolonnar",
      update_application: "Last inn appen på nytt",
    },
    boolean: {
      true: "Ja",
      false: "Nei",
      null: " ",
    },
    page: {
      create: "Opprett %{name}",
      dashboard: "Oversikt",
      edit: "%{name} %{recordRepresentation}",
      error: "Noko gjekk gale",
      list: "%{name}",
      loading: "Lastar",
      not_found: "Ikkje funne",
      show: "%{name} %{recordRepresentation}",
      empty: "Ingen %{name} enno.",
      invite: "Vil du leggje til ei oppføring?",
      access_denied: "Ingen tilgang",
      authentication_error: "Autentiseringsfeil",
    },
    input: {
      file: {
        upload_several:
          "Slepp filer for å laste opp, eller klikk for å velje ei.",
        upload_single:
          "Slepp ei fil for å laste opp, eller klikk for å velje henne.",
      },
      image: {
        upload_several:
          "Slepp bilete for å laste opp, eller klikk for å velje eit.",
        upload_single:
          "Slepp eit bilete for å laste opp, eller klikk for å velje det.",
      },
      references: {
        all_missing: "Fann ingen referansedata.",
        many_missing:
          "Minst éin av dei tilknytte referansane er ikkje lenger tilgjengeleg.",
        single_missing:
          "Den tilknytte referansen er ikkje lenger tilgjengeleg.",
      },
      password: {
        toggle_visible: "Skjul passord",
        toggle_hidden: "Vis passord",
      },
    },
    message: {
      about: "Om",
      access_denied: "Du har ikkje løyve til å opne denne sida",
      are_you_sure: "Er du sikker?",
      authentication_error:
        "Autentiseringstenaren returnerte ein feil, og påloggingsinformasjonen kunne ikkje kontrollerast.",
      auth_error:
        "Det oppstod ein feil ved validering av autentiseringstokenet.",
      bulk_delete_content:
        "Er du sikker på at du vil slette denne %{name}? |||| Er du sikker på at du vil slette desse %{smart_count} oppføringane?",
      bulk_delete_title: "Slett %{name} |||| Slett %{smart_count} %{name}",
      bulk_update_content:
        "Er du sikker på at du vil oppdatere %{name} %{recordRepresentation}? |||| Er du sikker på at du vil oppdatere desse %{smart_count} oppføringane?",
      bulk_update_title:
        "Oppdater %{name} %{recordRepresentation} |||| Oppdater %{smart_count} %{name}",
      clear_array_input: "Er du sikker på at du vil tømme heile lista?",
      delete_content: "Er du sikker på at du vil slette denne %{name}?",
      delete_title: "Slett %{name} %{recordRepresentation}",
      details: "Detaljar",
      error:
        "Det oppstod ein klientfeil, og førespurnaden kunne ikkje fullførast.",
      invalid_form: "Skjemaet inneheld feil. Kontroller felta",
      loading: "Ver venleg og vent",
      no: "Nei",
      not_found: "Du har skrive inn feil URL eller følgt ei ugyldig lenkje.",
      select_all_limit_reached:
        "Det er for mange oppføringar til å velje alle. Berre dei første %{max} vart valde.",
      unsaved_changes:
        "Nokre av endringane dine er ikkje lagra. Er du sikker på at du vil forkaste dei?",
      yes: "Ja",
      placeholder_data_warning:
        "Nettverksproblem: Dataa kunne ikkje oppdaterast.",
    },
    navigation: {
      clear_filters: "Fjern filter",
      no_filtered_results: "Fann ingen %{name} med dei gjeldande filtera.",
      no_results: "Fann ingen %{name}",
      no_more_results: "Side %{page} finst ikkje. Prøv førre side.",
      page_out_of_boundaries: "Side %{page} finst ikkje",
      page_out_from_end: "Kan ikkje gå forbi siste side",
      page_out_from_begin: "Kan ikkje gå før side 1",
      page_range_info: "%{offsetBegin}–%{offsetEnd} av %{total}",
      partial_page_range_info:
        "%{offsetBegin}–%{offsetEnd} av meir enn %{offsetEnd}",
      current_page: "Side %{page}",
      page: "Gå til side %{page}",
      first: "Gå til første side",
      last: "Gå til siste side",
      next: "Gå til neste side",
      previous: "Gå til førre side",
      page_rows_per_page: "Rader per side:",
      skip_nav: "Hopp til innhald",
    },
    sort: {
      sort_by: "Sorter etter %{field_lower_first} %{order}",
      ASC: "stigande",
      DESC: "søkkande",
    },
    auth: {
      auth_check_error: "Logg inn for å halde fram",
      user_menu: "Profil",
      username: "Brukarnamn",
      password: "Passord",
      email: "E-post",
      sign_in: "Logg inn",
      sign_in_error: "Innlogginga mislukkast. Prøv igjen",
      logout: "Logg ut",
    },
    notification: {
      updated: "Oppføring oppdatert |||| %{smart_count} oppføringar oppdaterte",
      created: "Oppføring oppretta",
      deleted: "Oppføring sletta |||| %{smart_count} oppføringar sletta",
      bad_item: "Ugyldig oppføring",
      item_doesnt_exist: "Oppføringa finst ikkje",
      http_error: "Feil ved kommunikasjon med tenaren",
      data_provider_error:
        "Feil i dataleverandøren. Sjå konsollen for detaljar.",
      i18n_error: "Kan ikkje laste omsetjingane for det valde språket",
      canceled: "Handlinga er avbroten",
      logged_out: "Økta di er utgått. Logg inn på nytt.",
      not_authorized: "Du har ikkje tilgang til denne ressursen.",
      application_update_available: "Ein ny versjon er tilgjengeleg.",
      offline: "Inga nettverkstilkopling. Klarte ikkje å hente data.",
    },
    validation: {
      required: "Påkravd",
      minLength: "Må innehalde minst %{min} teikn",
      maxLength: "Kan innehalde høgst %{max} teikn",
      minValue: "Må vere minst %{min}",
      maxValue: "Kan vere høgst %{max}",
      number: "Må vere eit tal",
      email: "Må vere ei gyldig e-postadresse",
      oneOf: "Må vere ein av: %{options}",
      regex: "Må følgje formatet (regulært uttrykk): %{pattern}",
      unique: "Må vere unik",
    },
    saved_queries: {
      label: "Lagra søk",
      query_name: "Søkjenamn",
      new_label: "Lagre gjeldande søk...",
      new_dialog_title: "Lagre gjeldande søk som",
      remove_label: "Fjern lagra søk",
      remove_label_with_name: "Fjern søket «%{name}»",
      remove_dialog_title: "Fjern lagra søk?",
      remove_message:
        "Er du sikker på at du vil fjerne dette søket frå lista over lagra søk?",
      help: "Filtrer lista og lagre søket til seinare",
    },
    configurable: {
      customize: "Tilpass",
      configureMode: "Tilpass denne sida",
      inspector: {
        title: "Inspektør",
        content: "Hald peikaren over elementa i appen for å tilpasse dei",
        reset: "Nullstill innstillingar",
        hideAll: "Skjul alle",
        showAll: "Vis alle",
      },
      Datagrid: {
        title: "Datatabell",
        unlabeled: "Kolonne utan namn #%{column}",
      },
      SimpleForm: {
        title: "Skjema",
        unlabeled: "Felt utan namn #%{input}",
      },
      SimpleList: {
        title: "Liste",
        primaryText: "Hovudtekst",
        secondaryText: "Sekundærtekst",
        tertiaryText: "Tertiærtekst",
      },
    },
  },
} satisfies TranslationMessages;

export const nynorskSupabaseMessages = {
  "ra-supabase": {
    auth: {
      email: "E-post",
      confirm_password: "Stadfest passord",
      sign_in_with: "Logg inn med %{provider}",
      forgot_password: "Gløymt passord?",
      reset_password: "Nullstill passord",
      password_reset:
        "Sjå etter ein e-post med lenkje for å nullstille passordet ditt.",
      missing_tokens: "Tilgangs- og oppdateringstoken manglar",
      back_to_login: "Tilbake til innlogging",
    },
    reset_password: {
      forgot_password: "Gløymt passord?",
      forgot_password_details:
        "Skriv inn e-postadressa di for å få instruksjonar.",
    },
    set_password: {
      new_password: "Vel passord",
    },
    validation: {
      password_mismatch: "Passorda er ikkje like",
    },
  },
} satisfies typeof raSupabaseEnglishMessages;
