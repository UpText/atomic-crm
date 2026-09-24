import type { TranslationMessages } from "ra-core";
import type { raSupabaseEnglishMessages } from "ra-supabase-language-english";

export const norwegianAdminMessages = {
  ra: {
    action: {
      add_filter: "Legg til filter",
      add: "Legg til",
      back: "Tilbake",
      bulk_actions: "1 oppføring valgt |||| %{smart_count} oppføringer valgt",
      cancel: "Avbryt",
      clear_array_input: "Tøm listen",
      clear_input_value: "Tøm verdi",
      clone: "Dupliser",
      confirm: "Bekreft",
      create: "Opprett",
      create_item: "Opprett %{item}",
      delete: "Slett",
      edit: "Rediger",
      export: "Eksporter",
      list: "Liste",
      refresh: "Oppdater",
      remove_filter: "Fjern dette filteret",
      remove_all_filters: "Fjern alle filtre",
      remove: "Fjern",
      reset: "Tilbakestill",
      save: "Lagre",
      search: "Søk",
      search_columns: "Søk i kolonner",
      select_all: "Velg alle",
      select_all_button: "Velg alle",
      select_row: "Velg denne raden",
      show: "Vis",
      sort: "Sorter",
      undo: "Angre",
      unselect: "Fjern valg",
      expand: "Utvid",
      close: "Lukk",
      open_menu: "Åpne meny",
      close_menu: "Lukk meny",
      update: "Oppdater",
      move_up: "Flytt opp",
      move_down: "Flytt ned",
      open: "Åpne",
      toggle_theme: "Bytt mellom lyst og mørkt tema",
      select_columns: "Kolonner",
      update_application: "Last inn appen på nytt",
    },
    boolean: { true: "Ja", false: "Nei", null: " " },
    page: {
      create: "Opprett %{name}",
      dashboard: "Oversikt",
      edit: "%{name} %{recordRepresentation}",
      error: "Noe gikk galt",
      list: "%{name}",
      loading: "Laster",
      not_found: "Ikke funnet",
      show: "%{name} %{recordRepresentation}",
      empty: "Ingen %{name} ennå.",
      invite: "Vil du legge til en?",
      access_denied: "Ingen tilgang",
      authentication_error: "Autentiseringsfeil",
    },
    input: {
      file: {
        upload_several:
          "Slipp filer for å laste opp, eller klikk for å velge en.",
        upload_single:
          "Slipp en fil for å laste opp, eller klikk for å velge den.",
      },
      image: {
        upload_several:
          "Slipp bilder for å laste opp, eller klikk for å velge et.",
        upload_single:
          "Slipp et bilde for å laste opp, eller klikk for å velge det.",
      },
      references: {
        all_missing: "Fant ingen referansedata.",
        many_missing:
          "Minst én av de tilknyttede referansene er ikke lenger tilgjengelig.",
        single_missing:
          "Den tilknyttede referansen er ikke lenger tilgjengelig.",
      },
      password: {
        toggle_visible: "Skjul passord",
        toggle_hidden: "Vis passord",
      },
    },
    message: {
      about: "Om",
      access_denied: "Du har ikke tillatelse til å åpne denne siden",
      are_you_sure: "Er du sikker?",
      authentication_error:
        "Autentiseringsserveren returnerte en feil, og påloggingsinformasjonen kunne ikke kontrolleres.",
      auth_error:
        "Det oppstod en feil ved validering av autentiseringstokenet.",
      bulk_delete_content:
        "Er du sikker på at du vil slette denne %{name}? |||| Er du sikker på at du vil slette disse %{smart_count} oppføringene?",
      bulk_delete_title: "Slett %{name} |||| Slett %{smart_count} %{name}",
      bulk_update_content:
        "Er du sikker på at du vil oppdatere %{name} %{recordRepresentation}? |||| Er du sikker på at du vil oppdatere disse %{smart_count} oppføringene?",
      bulk_update_title:
        "Oppdater %{name} %{recordRepresentation} |||| Oppdater %{smart_count} %{name}",
      clear_array_input: "Er du sikker på at du vil tømme hele listen?",
      delete_content: "Er du sikker på at du vil slette denne %{name}?",
      delete_title: "Slett %{name} %{recordRepresentation}",
      details: "Detaljer",
      error:
        "Det oppstod en klientfeil, og forespørselen kunne ikke fullføres.",
      invalid_form: "Skjemaet inneholder feil. Kontroller feltene",
      loading: "Vennligst vent",
      no: "Nei",
      not_found: "Du har skrevet inn feil URL eller fulgt en ugyldig lenke.",
      select_all_limit_reached:
        "Det er for mange oppføringer til å velge alle. Bare de første %{max} ble valgt.",
      unsaved_changes:
        "Noen av endringene dine er ikke lagret. Er du sikker på at du vil forkaste dem?",
      yes: "Ja",
      placeholder_data_warning:
        "Nettverksproblem: Dataene kunne ikke oppdateres.",
    },
    navigation: {
      clear_filters: "Fjern filtre",
      no_filtered_results: "Ingen %{name} funnet med de gjeldende filtrene.",
      no_results: "Ingen %{name} funnet",
      no_more_results: "Side %{page} finnes ikke. Prøv forrige side.",
      page_out_of_boundaries: "Side %{page} finnes ikke",
      page_out_from_end: "Kan ikke gå forbi siste side",
      page_out_from_begin: "Kan ikke gå før side 1",
      page_range_info: "%{offsetBegin}–%{offsetEnd} av %{total}",
      partial_page_range_info:
        "%{offsetBegin}–%{offsetEnd} av mer enn %{offsetEnd}",
      current_page: "Side %{page}",
      page: "Gå til side %{page}",
      first: "Gå til første side",
      last: "Gå til siste side",
      next: "Gå til neste side",
      previous: "Gå til forrige side",
      page_rows_per_page: "Rader per side:",
      skip_nav: "Hopp til innhold",
    },
    sort: {
      sort_by: "Sorter etter %{field_lower_first} %{order}",
      ASC: "stigende",
      DESC: "synkende",
    },
    auth: {
      auth_check_error: "Logg inn for å fortsette",
      user_menu: "Profil",
      username: "Brukernavn",
      password: "Passord",
      email: "E-post",
      sign_in: "Logg inn",
      sign_in_error: "Innloggingen mislyktes. Prøv igjen",
      logout: "Logg ut",
    },
    notification: {
      updated: "Oppføring oppdatert |||| %{smart_count} oppføringer oppdatert",
      created: "Oppføring opprettet",
      deleted: "Oppføring slettet |||| %{smart_count} oppføringer slettet",
      bad_item: "Ugyldig oppføring",
      item_doesnt_exist: "Oppføringen finnes ikke",
      http_error: "Feil ved kommunikasjon med serveren",
      data_provider_error:
        "Feil i dataleverandøren. Se konsollen for detaljer.",
      i18n_error: "Kan ikke laste oversettelsene for det valgte språket",
      canceled: "Handlingen er avbrutt",
      logged_out: "Økten din er utløpt. Logg inn på nytt.",
      not_authorized: "Du har ikke tilgang til denne ressursen.",
      application_update_available: "En ny versjon er tilgjengelig.",
      offline: "Ingen nettverkstilkobling. Kunne ikke hente data.",
    },
    validation: {
      required: "Påkrevd",
      minLength: "Må inneholde minst %{min} tegn",
      maxLength: "Kan inneholde høyst %{max} tegn",
      minValue: "Må være minst %{min}",
      maxValue: "Kan være høyst %{max}",
      number: "Må være et tall",
      email: "Må være en gyldig e-postadresse",
      oneOf: "Må være en av: %{options}",
      regex: "Må følge formatet (regulært uttrykk): %{pattern}",
      unique: "Må være unik",
    },
    saved_queries: {
      label: "Lagrede søk",
      query_name: "Søkenavn",
      new_label: "Lagre gjeldende søk...",
      new_dialog_title: "Lagre gjeldende søk som",
      remove_label: "Fjern lagret søk",
      remove_label_with_name: "Fjern søket «%{name}»",
      remove_dialog_title: "Fjern lagret søk?",
      remove_message:
        "Er du sikker på at du vil fjerne dette søket fra listen over lagrede søk?",
      help: "Filtrer listen og lagre søket til senere",
    },
    configurable: {
      customize: "Tilpass",
      configureMode: "Tilpass denne siden",
      inspector: {
        title: "Inspektør",
        content: "Hold pekeren over elementene i appen for å tilpasse dem",
        reset: "Tilbakestill innstillinger",
        hideAll: "Skjul alle",
        showAll: "Vis alle",
      },
      Datagrid: {
        title: "Datatabell",
        unlabeled: "Kolonne uten navn #%{column}",
      },
      SimpleForm: { title: "Skjema", unlabeled: "Felt uten navn #%{input}" },
      SimpleList: {
        title: "Liste",
        primaryText: "Hovedtekst",
        secondaryText: "Sekundærtekst",
        tertiaryText: "Tertiærtekst",
      },
    },
  },
} satisfies TranslationMessages;

export const norwegianSupabaseMessages = {
  "ra-supabase": {
    auth: {
      email: "E-post",
      confirm_password: "Bekreft passord",
      sign_in_with: "Logg inn med %{provider}",
      forgot_password: "Glemt passord?",
      reset_password: "Tilbakestill passord",
      password_reset:
        "Se etter en e-post med lenke for å tilbakestille passordet ditt.",
      missing_tokens: "Tilgangs- og oppdateringstoken mangler",
      back_to_login: "Tilbake til innlogging",
    },
    reset_password: {
      forgot_password: "Glemt passord?",
      forgot_password_details:
        "Skriv inn e-postadressen din for å få instruksjoner.",
    },
    set_password: { new_password: "Velg passord" },
    validation: { password_mismatch: "Passordene er ikke like" },
  },
} satisfies typeof raSupabaseEnglishMessages;
