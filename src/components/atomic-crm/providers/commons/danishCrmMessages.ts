import type { CrmMessages } from "./englishCrmMessages";

export const danishCrmMessages = {
  resources: {
    companies: {
      name: "Virksomhed |||| Virksomheder",
      forcedCaseName: "Virksomhed",
      fields: {
        name: "Virksomhedsnavn",
        website: "Websted",
        linkedin_url: "LinkedIn-URL",
        phone_number: "Telefonnummer",
        created_at: "Oprettet",
        nb_contacts: "Antal kontakter",
        revenue: "Omsætning",
        sector: "Branche",
        size: "Størrelse",
        tax_identifier: "CVR-nummer",
        address: "Adresse",
        city: "By",
        zipcode: "Postnummer",
        state_abbr: "Delstat",
        country: "Land",
        description: "Beskrivelse",
        context_links: "Kontekstlinks",
        sales_id: "Kundeansvarlig",
      },
      empty: {
        description: "Din virksomhedsliste er tom.",
        title: "Ingen virksomheder fundet",
      },
      field_categories: {
        contact: "Kontakt",
        additional_info: "Yderligere oplysninger",
        address: "Adresse",
        context: "Kontekst",
      },
      action: {
        create: "Opret virksomhed",
        edit: "Rediger virksomhed",
        new: "Ny virksomhed",
        show: "Vis virksomhed",
      },
      added_on: "Tilføjet %{date}",
      followed_by: "Følges af %{name}",
      followed_by_you: "Følges af dig",
      no_contacts: "Ingen kontakter",
      nb_contacts: "%{smart_count} kontakt |||| %{smart_count} kontakter",
      nb_deals:
        "%{smart_count} salgsmulighed |||| %{smart_count} salgsmuligheder",
      sizes: {
        one_employee: "1 medarbejder",
        two_to_nine_employees: "2–9 medarbejdere",
        ten_to_forty_nine_employees: "10–49 medarbejdere",
        fifty_to_two_hundred_forty_nine_employees: "50–249 medarbejdere",
        two_hundred_fifty_or_more_employees: "250 eller flere medarbejdere",
      },
      autocomplete: {
        create_error: "Der opstod en fejl under oprettelsen af virksomheden",
        create_item: "Opret %{item}",
        create_label: "Begynd at skrive for at oprette en ny virksomhed",
      },
      filters: {
        only_mine: "Kun virksomheder jeg er ansvarlig for",
      },
    },
    contacts: {
      name: "Kontakt |||| Kontakter",
      forcedCaseName: "Kontakt",
      field_categories: {
        background_info: "Baggrundsoplysninger",
        identity: "Identitet",
        misc: "Andet",
        personal_info: "Personoplysninger",
        position: "Stilling",
      },
      fields: {
        first_name: "Fornavn",
        last_name: "Efternavn",
        last_seen: "Sidst set",
        title: "Titel",
        company_id: "Virksomhed",
        email_jsonb: "E-mailadresser",
        email: "E-mail",
        phone_jsonb: "Telefonnumre",
        phone_number: "Telefonnummer",
        linkedin_url: "LinkedIn-URL",
        background: "Baggrundsoplysninger (biografi, hvordan I mødtes osv.)",
        has_newsletter: "Modtager nyhedsbrev",
        sales_id: "Kundeansvarlig",
      },
      action: {
        add: "Tilføj kontakt",
        add_first: "Tilføj din første kontakt",
        create: "Opret kontakt",
        edit: "Rediger kontakt",
        export_vcard: "Eksporter til vCard",
        new: "Ny kontakt",
        show: "Vis kontakt",
      },
      background: {
        last_activity_on: "Seneste aktivitet %{date}",
        added_on: "Tilføjet %{date}",
        followed_by: "Følges af %{name}",
        followed_by_you: "Følges af dig",
        status_none: "Ingen",
      },
      position_at: "%{title} hos",
      position_at_company: "%{title} hos %{company}",
      empty: {
        description: "Din kontaktliste er tom.",
        title: "Ingen kontakter fundet",
      },
      import: {
        title: "Importer kontakter",
        button: "Importer CSV",
        complete:
          "Importen af kontakter er fuldført. Importerede %{importCount} kontakter med %{errorCount} fejl",
        progress:
          "Importerede %{importCount} / %{rowCount} kontakter med %{errorCount} fejl.",
        error:
          "Filen kunne ikke importeres. Kontrollér, at du har valgt en gyldig CSV-fil.",
        imported: "Importeret",
        remaining_time: "Anslået resterende tid:",
        running: "Importen er i gang. Luk ikke denne fane.",
        sample_download: "Download CSV-eksempel",
        sample_hint: "Her er en CSV-eksempelfil, du kan bruge som skabelon",
        stop: "Stop import",
        csv_file: "CSV-fil",
        contacts_label: "kontakt |||| kontakter",
      },
      inputs: {
        genders: {
          male: "Han/ham",
          female: "Hun/hende",
          nonbinary: "De/dem",
        },
        personal_info_types: {
          work: "Arbejde",
          home: "Hjem",
          other: "Andet",
        },
      },
      list: {
        error_loading: "Fejl ved indlæsning af kontakter",
      },
      bulk_tag: {
        action: "Etiket",
        back: "Tilbage til etiketter",
        create_description:
          "Opret en ny etiket, og føj den til de valgte kontakter.",
        description:
          "Vælg en eksisterende etiket, eller opret en ny til de valgte kontakter.",
        empty:
          "Ingen etiketter endnu. Opret en for at mærke de valgte kontakter.",
        error: "Etiketten kunne ikke føjes til kontakterne",
        noop: "De valgte kontakter har allerede denne etiket",
        success:
          "Etiket føjet til %{smart_count} kontakt |||| Etiket føjet til %{smart_count} kontakter",
        title: "Føj etiket til kontakter",
      },
      merge: {
        action: "Flet med en anden kontakt",
        confirm: "Flet kontakter",
        current_contact: "Nuværende kontakt (slettes)",
        description: "Flet denne kontakt med en anden.",
        error: "Kontakterne kunne ikke flettes",
        merging: "Fletter...",
        no_additional_data: "Ingen yderligere data at flette",
        select_target: "Vælg en kontakt at flette med",
        success: "Kontakterne er flettet",
        target_contact: "Målkontakt (beholdes)",
        title: "Flet kontakt",
        warning_description:
          "Alle data overføres til den anden kontakt. Denne handling kan ikke fortrydes.",
        warning_title: "Advarsel: Handlingen kan ikke fortrydes",
        what_will_be_merged: "Dette flettes:",
      },
      filters: {
        before_last_month: "Før sidste måned",
        before_this_month: "Før denne måned",
        before_this_week: "Før denne uge",
        managed_by_me: "Jeg er ansvarlig",
        search: "Søg efter navn, virksomhed...",
        this_week: "Denne uge",
        today: "I dag",
        tags: "Etiketter",
        tasks: "Opgaver",
      },
      hot: {
        empty_change_status:
          "Skift en kontakts status ved at tilføje en note og klikke på »Vis indstillinger«.",
        empty_hint: "Kontakter med status »hot« vises her.",
        title: "Varme kontakter",
      },
    },
    deals: {
      name: "Salgsmulighed |||| Salgsmuligheder",
      fields: {
        name: "Navn",
        description: "Beskrivelse",
        company_id: "Virksomhed",
        contact_ids: "Kontakter",
        category: "Kategori",
        amount: "Budget",
        expected_closing_date: "Forventet afslutningsdato",
        stage: "Fase",
      },
      action: {
        back_to_deal: "Tilbage til salgsmuligheden",
        create: "Opret salgsmulighed",
        new: "Ny salgsmulighed",
      },
      field_categories: {
        misc: "Andet",
      },
      archived: {
        action: "Arkivér",
        error: "Fejl: Salgsmuligheden blev ikke arkiveret",
        list_title: "Arkiverede salgsmuligheder",
        success: "Salgsmuligheden er arkiveret",
        title: "Arkiveret salgsmulighed",
        view: "Vis arkiverede salgsmuligheder",
      },
      inputs: {
        linked_to: "Knyttet til",
      },
      unarchived: {
        action: "Flyt tilbage til tavlen",
        error: "Fejl: Salgsmuligheden blev ikke gendannet",
        success: "Salgsmuligheden er gendannet",
      },
      updated: "Salgsmuligheden er opdateret",
      empty: {
        before_create: "før du opretter en salgsmulighed.",
        description: "Din liste over salgsmuligheder er tom.",
        title: "Ingen salgsmuligheder fundet",
      },
      invalid_date: "Ugyldig dato",
    },
    tenants: {
      name: "Organisation |||| Organisationer",
      fields: {
        name: "Organisation",
        display_name: "Visningsnavn",
        active: "Aktiv",
        activated_at: "Aktiveret",
        deactivated_at: "Deaktiveret",
        created_at: "Oprettet",
        admin_email: "Administratorens e-mail",
        password: "Administratorens adgangskode",
      },
      action: {
        create: "Opret organisation",
        edit: "Rediger organisation",
        new: "Ny organisation",
      },
    },
    notes: {
      name: "Note |||| Noter",
      forcedCaseName: "Note",
      fields: {
        status: "Status",
        date: "Dato",
        attachments: "Vedhæftninger",
        contact_id: "Kontakt",
        deal_id: "Salgsmulighed",
      },
      action: {
        add: "Tilføj note",
        add_first: "Tilføj din første note",
        delete: "Slet note",
        edit: "Rediger note",
        update: "Opdater note",
        add_this: "Tilføj denne note",
      },
      sheet: {
        create: "Opret note",
        create_for: "Opret note til %{name}",
        edit: "Rediger note",
        edit_for: "Rediger note til %{name}",
      },
      deleted: "Noten er slettet",
      empty: "Ingen noter endnu",
      author_added: "%{name} tilføjede en note",
      you_added: "Du tilføjede en note",
      me: "Mig",
      list: {
        error_loading: "Fejl ved indlæsning af noter",
      },
      note_for_contact: "Note til %{name}",
      stepper: {
        hint: "Gå til en kontaktside, og tilføj en note",
      },
      added: "Noten er tilføjet",
      inputs: {
        add_note: "Tilføj en note",
        options_hint: "(vedhæft filer, eller rediger detaljer)",
        show_options: "Vis indstillinger",
      },
      actions: {
        attach_document: "Vedhæft dokument",
      },
      validation: {
        note_or_attachment_required: "En note eller en vedhæftning er påkrævet",
      },
    },
    sales: {
      name: "Bruger |||| Brugere",
      fields: {
        first_name: "Fornavn",
        last_name: "Efternavn",
        email: "E-mail",
        administrator: "Administrator",
        disabled: "Deaktiveret",
      },
      create: {
        error: "Der opstod en fejl under oprettelsen af brugeren.",
        success:
          "Brugeren er oprettet og modtager snart en e-mail for at angive sin adgangskode.",
        title: "Opret en ny bruger",
      },
      edit: {
        error: "Der opstod en fejl. Prøv igen.",
        record_not_found: "Posten blev ikke fundet",
        success: "Brugeren er opdateret",
        title: "Rediger %{name}",
      },
      action: {
        new: "Ny bruger",
      },
    },
    tasks: {
      name: "Opgave |||| Opgaver",
      forcedCaseName: "Opgave",
      fields: {
        text: "Beskrivelse",
        due_date: "Frist",
        type: "Type",
        contact_id: "Kontakt",
        due_short: "frist",
      },
      action: {
        add: "Tilføj opgave",
        create: "Opret opgave",
        edit: "Rediger opgave",
      },
      actions: {
        postpone_next_week: "Udsæt til næste uge",
        postpone_tomorrow: "Udsæt til i morgen",
        title: "Opgavehandlinger",
      },
      added: "Opgaven er tilføjet",
      deleted: "Opgaven er slettet",
      dialog: {
        create: "Opret opgave",
        create_for: "Opret opgave til %{name}",
      },
      sheet: {
        edit: "Rediger opgave",
        edit_for: "Rediger opgave til %{name}",
      },
      empty: "Ingen opgaver endnu",
      empty_list_hint: "Opgaver, der er tilføjet dine kontakter, vises her.",
      filters: {
        later: "Senere",
        overdue: "Forfaldne",
        this_week: "Denne uge",
        today: "I dag",
        tomorrow: "I morgen",
        with_pending: "Med udestående opgaver",
      },
      regarding_contact: "(Vedr.: %{name})",
      updated: "Opgaven er opdateret",
    },
    tags: {
      name: "Etiket |||| Etiketter",
      action: {
        add: "Tilføj etiket",
        create: "Opret ny etiket",
      },
      dialog: {
        color: "Farve",
        create_title: "Opret en ny etiket",
        edit_title: "Rediger etiket",
        name_label: "Etiketnavn",
        name_placeholder: "Indtast etiketnavn",
      },
    },
  },
  crm: {
    action: {
      reset_password: "Nulstil adgangskode",
    },
    auth: {
      first_name: "Fornavn",
      last_name: "Efternavn",
      confirm_password: "Bekræft adgangskode",
      confirmation_required:
        "Følg linket, vi netop har sendt dig via e-mail, for at bekræfte din konto.",
      recovery_email_sent:
        "Hvis du er registreret som bruger, modtager du snart en e-mail til nulstilling af adgangskoden.",
      sign_in_failed: "Kunne ikke logge ind.",
      sign_in_google_workspace: "Log ind med Google Workspace",
      signup: {
        create_account: "Opret konto",
        create_first_user:
          "Opret den første brugerkonto for at fuldføre opsætningen.",
        creating: "Opretter...",
        initial_user_created: "Den første bruger er oprettet",
      },
      welcome_title: "Velkommen til UpTextCrm",
    },
    common: {
      activity: "Aktivitet",
      added: "tilføjet",
      details: "Detaljer",
      last_activity_with_date: "seneste aktivitet %{date}",
      load_more: "Indlæs flere",
      misc: "Andet",
      past: "Tidligere",
      read_more: "Læs mere",
      retry: "Prøv igen",
      show_less: "Vis mindre",
      copied: "Kopieret!",
      copy: "Kopiér",
      loading: "Indlæser...",
      me: "Mig",
      task_count: "%{smart_count} opgave |||| %{smart_count} opgaver",
    },
    changelog: {
      title: "Ændringslog",
    },
    activity: {
      added_company: "%{name} tilføjede virksomheden",
      you_added_company: "Du tilføjede virksomheden",
      added_contact: "%{name} tilføjede",
      you_added_contact: "Du tilføjede",
      added_note: "%{name} tilføjede en note om",
      you_added_note: "Du tilføjede en note om",
      added_note_about_deal: "%{name} tilføjede en note om salgsmuligheden",
      you_added_note_about_deal: "Du tilføjede en note om salgsmuligheden",
      added_deal: "%{name} tilføjede salgsmuligheden",
      you_added_deal: "Du tilføjede salgsmuligheden",
      at_company: "hos",
      to: "til",
      load_more: "Indlæs mere aktivitet",
    },
    dashboard: {
      sqlwebapi_description:
        "er et komplet CRM-system med SQL Server som database.",
      deals_chart: "Forventede salgsindtægter",
      deals_pipeline: "Salgspipeline",
      latest_activity: "Seneste aktivitet",
      latest_activity_error: "Fejl ved indlæsning af seneste aktivitet",
      latest_notes: "Mine seneste noter",
      latest_notes_added_ago: "tilføjet %{timeAgo}",
      stepper: {
        install: "Installer UpTextCrm",
        progress: "%{step}/3 fuldført",
        whats_next: "Hvad er næste skridt?",
      },
      upcoming_tasks: "Kommende opgaver",
    },
    header: {
      import_data: "Importer data",
    },
    image_editor: {
      change: "Skift",
      drop_hint: "Slip en fil for at uploade, eller klik for at vælge den.",
      editable_content: "Redigerbart indhold",
      title: "Upload og tilpas billedstørrelse",
      update_image: "Opdater billede",
    },
    import: {
      action: {
        download_error_report: "Download fejlrapporten",
        export: "Eksporter",
        import: "Importer",
        import_another: "Importer en anden fil",
      },
      error: {
        unable: "Filen kunne ikke importeres.",
        unable_export: "Data kunne ikke eksporteres.",
      },
      idle: {
        description_1:
          "Du kan importere brugere, virksomheder, kontakter, noter og opgaver.",
        description_2:
          "Data skal være i en JSON-fil, der følger dette eksempel:",
        description_3:
          "Du kan også eksportere det aktuelle datasæt som en JSON-fil, der kan importeres.",
      },
      status: {
        all_success: "Alle poster blev importeret.",
        complete: "Importen er fuldført.",
        export_complete: "Eksporten er fuldført.",
        failed: "Mislykkedes",
        imported: "Importeret",
        in_progress: "Importen er i gang. Forlad ikke denne side.",
        some_failed: "Nogle poster blev ikke importeret.",
        table_caption: "Importstatus",
      },
      title: "Importer data",
    },
    settings: {
      about: "Om",
      companies: {
        sectors: "Brancher",
      },
      dark_mode_logo: "Logo til mørkt tema",
      deals: {
        categories: "Kategorier",
        currency: "Valuta",
        pipeline_help:
          "Vælg, hvilke salgsfaser der skal indgå i salgspipelinen.",
        pipeline_statuses: "Pipelinestatusser",
        stages: "Faser",
      },
      light_mode_logo: "Logo til lyst tema",
      notes: {
        statuses: "Statusser",
      },
      reset_defaults: "Gendan standardindstillinger",
      save_error: "Indstillingerne kunne ikke gemmes",
      saved: "Indstillingerne er gemt",
      saving: "Gemmer...",
      tasks: {
        types: "Typer",
      },
      preferences: "Præferencer",
      title: "Indstillinger",
      app_title: "Appnavn",
      sections: {
        branding: "Branding",
      },
      validation: {
        duplicate: "Dublet af %{display_name}: %{items}",
        in_use:
          "Kan ikke fjerne %{display_name}, der stadig bruges af salgsmuligheder: %{items}",
        validating: "Validerer…",
        entities: {
          categories: "kategorier",
          stages: "faser",
        },
      },
    },
    theme: {
      dark: "Mørkt",
      label: "Tema",
      light: "Lyst",
      system: "System",
    },
    language: "Sprog",
    navigation: {
      label: "CRM-navigation",
    },
    profile: {
      inbound: {
        description:
          "Du kan sende e-mails til serverens indgående e-mailadresse, f.eks. ved at føje den til feltet %{field}. UpTextCrm behandler e-mails og føjer noter til de tilsvarende kontakter.",
        title: "Indgående e-mail",
      },
      mcp: {
        title: "MCP-server",
        description:
          "Brug denne URL til at forbinde din AI-assistent med dine CRM-data via Model Context Protocol (MCP).",
      },
      password: {
        enter_new: "Indtast en ny adgangskode",
        empty: "Adgangskoden må ikke være tom",
        update_error: "Adgangskoden kunne ikke opdateres",
        change: "Skift adgangskode",
      },
      password_updated: "Adgangskoden er opdateret",
      password_reset_sent:
        "En e-mail til nulstilling af adgangskoden er sendt til din e-mailadresse",
      record_not_found: "Posten blev ikke fundet",
      title: "Profil",
      updated: "Din profil er opdateret",
      update_error: "Der opstod en fejl. Prøv igen",
    },
    validation: {
      invalid_url: "Skal være en gyldig URL",
      invalid_linkedin_url: "URL'en skal være fra linkedin.com",
    },
  },
} satisfies CrmMessages;
