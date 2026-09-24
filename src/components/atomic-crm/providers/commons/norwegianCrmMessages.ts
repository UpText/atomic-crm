import type { CrmMessages } from "./englishCrmMessages";

export const norwegianCrmMessages = {
  resources: {
    companies: {
      name: "Bedrift |||| Bedrifter",
      forcedCaseName: "Bedrift",
      fields: {
        name: "Bedriftsnavn",
        website: "Nettsted",
        linkedin_url: "LinkedIn-URL",
        phone_number: "Telefonnummer",
        created_at: "Opprettet",
        nb_contacts: "Antall kontakter",
        revenue: "Omsetning",
        sector: "Bransje",
        size: "Størrelse",
        tax_identifier: "Organisasjonsnummer",
        address: "Adresse",
        city: "Poststed",
        zipcode: "Postnummer",
        state_abbr: "Delstat",
        country: "Land",
        description: "Beskrivelse",
        context_links: "Kontekstlenker",
        sales_id: "Kundeansvarlig",
      },
      empty: {
        description: "Bedriftslisten din er tom.",
        title: "Ingen bedrifter funnet",
      },
      field_categories: {
        contact: "Kontakt",
        additional_info: "Tilleggsinformasjon",
        address: "Adresse",
        context: "Kontekst",
      },
      action: {
        create: "Opprett bedrift",
        edit: "Rediger bedrift",
        new: "Ny bedrift",
        show: "Vis bedrift",
      },
      added_on: "Lagt til %{date}",
      followed_by: "Fulgt av %{name}",
      followed_by_you: "Fulgt av deg",
      no_contacts: "Ingen kontakter",
      nb_contacts: "%{smart_count} kontakt |||| %{smart_count} kontakter",
      nb_deals:
        "%{smart_count} salgsmulighet |||| %{smart_count} salgsmuligheter",
      sizes: {
        one_employee: "1 ansatt",
        two_to_nine_employees: "2–9 ansatte",
        ten_to_forty_nine_employees: "10–49 ansatte",
        fifty_to_two_hundred_forty_nine_employees: "50–249 ansatte",
        two_hundred_fifty_or_more_employees: "250 eller flere ansatte",
      },
      autocomplete: {
        create_error: "Det oppstod en feil ved oppretting av bedriften",
        create_item: "Opprett %{item}",
        create_label: "Begynn å skrive for å opprette en ny bedrift",
      },
      filters: {
        only_mine: "Bare bedrifter jeg er ansvarlig for",
      },
    },
    contacts: {
      name: "Kontakt |||| Kontakter",
      forcedCaseName: "Kontakt",
      field_categories: {
        background_info: "Bakgrunnsinformasjon",
        identity: "Identitet",
        misc: "Annet",
        personal_info: "Personopplysninger",
        position: "Stilling",
      },
      fields: {
        first_name: "Fornavn",
        last_name: "Etternavn",
        last_seen: "Sist sett",
        title: "Tittel",
        company_id: "Bedrift",
        email_jsonb: "E-postadresser",
        email: "E-post",
        phone_jsonb: "Telefonnumre",
        phone_number: "Telefonnummer",
        linkedin_url: "LinkedIn-URL",
        background: "Bakgrunnsinformasjon (biografi, hvordan dere møttes osv.)",
        has_newsletter: "Mottar nyhetsbrev",
        sales_id: "Kundeansvarlig",
      },
      action: {
        add: "Legg til kontakt",
        add_first: "Legg til din første kontakt",
        create: "Opprett kontakt",
        edit: "Rediger kontakt",
        export_vcard: "Eksporter til vCard",
        new: "Ny kontakt",
        show: "Vis kontakt",
      },
      background: {
        last_activity_on: "Siste aktivitet %{date}",
        added_on: "Lagt til %{date}",
        followed_by: "Fulgt av %{name}",
        followed_by_you: "Fulgt av deg",
        status_none: "Ingen",
      },
      position_at: "%{title} hos",
      position_at_company: "%{title} hos %{company}",
      empty: {
        description: "Kontaktlisten din er tom.",
        title: "Ingen kontakter funnet",
      },
      import: {
        title: "Importer kontakter",
        button: "Importer CSV",
        complete:
          "Import av kontakter er fullført. Importerte %{importCount} kontakter, med %{errorCount} feil",
        progress:
          "Importerte %{importCount} / %{rowCount} kontakter, med %{errorCount} feil.",
        error:
          "Kunne ikke importere filen. Kontroller at du har valgt en gyldig CSV-fil.",
        imported: "Importert",
        remaining_time: "Anslått gjenstående tid:",
        running: "Importen pågår. Ikke lukk denne fanen.",
        sample_download: "Last ned CSV-eksempel",
        sample_hint: "Her er en CSV-eksempelfil du kan bruke som mal",
        stop: "Stopp import",
        csv_file: "CSV-fil",
        contacts_label: "kontakt |||| kontakter",
      },
      inputs: {
        genders: {
          male: "Han/ham",
          female: "Hun/henne",
          nonbinary: "Hen/hen",
        },
        personal_info_types: {
          work: "Jobb",
          home: "Hjem",
          other: "Annet",
        },
      },
      list: {
        error_loading: "Feil ved lasting av kontakter",
      },
      bulk_tag: {
        action: "Etikett",
        back: "Tilbake til etiketter",
        create_description:
          "Opprett en ny etikett og legg den til de valgte kontaktene.",
        description:
          "Velg en eksisterende etikett eller opprett en ny for de valgte kontaktene.",
        empty:
          "Ingen etiketter ennå. Opprett en for å merke de valgte kontaktene.",
        error: "Kunne ikke legge til etikett på kontaktene",
        noop: "De valgte kontaktene har allerede denne etiketten",
        success:
          "Etikett lagt til på %{smart_count} kontakt |||| Etikett lagt til på %{smart_count} kontakter",
        title: "Legg til etikett på kontakter",
      },
      merge: {
        action: "Slå sammen med en annen kontakt",
        confirm: "Slå sammen kontakter",
        current_contact: "Nåværende kontakt (slettes)",
        description: "Slå sammen denne kontakten med en annen.",
        error: "Kunne ikke slå sammen kontaktene",
        merging: "Slår sammen...",
        no_additional_data: "Ingen flere data å slå sammen",
        select_target: "Velg en kontakt å slå sammen med",
        success: "Kontaktene er slått sammen",
        target_contact: "Målkontakt (beholdes)",
        title: "Slå sammen kontakt",
        warning_description:
          "Alle data overføres til den andre kontakten. Denne handlingen kan ikke angres.",
        warning_title: "Advarsel: Handlingen kan ikke angres",
        what_will_be_merged: "Dette slås sammen:",
      },
      filters: {
        before_last_month: "Før forrige måned",
        before_this_month: "Før denne måneden",
        before_this_week: "Før denne uken",
        managed_by_me: "Jeg er ansvarlig",
        search: "Søk etter navn, bedrift...",
        this_week: "Denne uken",
        today: "I dag",
        tags: "Etiketter",
        tasks: "Oppgaver",
      },
      hot: {
        empty_change_status:
          "Endre statusen til en kontakt ved å legge til et notat og klikke på «Vis alternativer».",
        empty_hint: "Kontakter med statusen «hot» vises her.",
        title: "Varme kontakter",
      },
    },
    deals: {
      name: "Salgsmulighet |||| Salgsmuligheter",
      fields: {
        name: "Navn",
        description: "Beskrivelse",
        company_id: "Bedrift",
        contact_ids: "Kontakter",
        category: "Kategori",
        amount: "Budsjett",
        expected_closing_date: "Forventet avslutningsdato",
        stage: "Fase",
      },
      action: {
        back_to_deal: "Tilbake til salgsmuligheten",
        create: "Opprett salgsmulighet",
        new: "Ny salgsmulighet",
      },
      field_categories: {
        misc: "Annet",
      },
      archived: {
        action: "Arkiver",
        error: "Feil: Salgsmuligheten ble ikke arkivert",
        list_title: "Arkiverte salgsmuligheter",
        success: "Salgsmuligheten er arkivert",
        title: "Arkivert salgsmulighet",
        view: "Vis arkiverte salgsmuligheter",
      },
      inputs: {
        linked_to: "Knyttet til",
      },
      unarchived: {
        action: "Flytt tilbake til tavlen",
        error: "Feil: Salgsmuligheten ble ikke gjenopprettet",
        success: "Salgsmuligheten er gjenopprettet",
      },
      updated: "Salgsmuligheten er oppdatert",
      empty: {
        before_create: "før du oppretter en salgsmulighet.",
        description: "Listen over salgsmuligheter er tom.",
        title: "Ingen salgsmuligheter funnet",
      },
      invalid_date: "Ugyldig dato",
    },
    tenants: {
      name: "Organisasjon |||| Organisasjoner",
      fields: {
        name: "Organisasjon",
        display_name: "Visningsnavn",
        active: "Aktiv",
        activated_at: "Aktivert",
        deactivated_at: "Deaktivert",
        created_at: "Opprettet",
        admin_email: "Administratorens e-post",
        password: "Administratorens passord",
      },
      action: {
        create: "Opprett organisasjon",
        edit: "Rediger organisasjon",
        new: "Ny organisasjon",
      },
    },
    notes: {
      name: "Notat |||| Notater",
      forcedCaseName: "Notat",
      fields: {
        status: "Status",
        date: "Dato",
        attachments: "Vedlegg",
        contact_id: "Kontakt",
        deal_id: "Salgsmulighet",
      },
      action: {
        add: "Legg til notat",
        add_first: "Legg til ditt første notat",
        delete: "Slett notat",
        edit: "Rediger notat",
        update: "Oppdater notat",
        add_this: "Legg til dette notatet",
      },
      sheet: {
        create: "Opprett notat",
        create_for: "Opprett notat for %{name}",
        edit: "Rediger notat",
        edit_for: "Rediger notat for %{name}",
      },
      deleted: "Notatet er slettet",
      empty: "Ingen notater ennå",
      author_added: "%{name} la til et notat",
      you_added: "Du la til et notat",
      me: "Meg",
      list: {
        error_loading: "Feil ved lasting av notater",
      },
      note_for_contact: "Notat for %{name}",
      stepper: {
        hint: "Gå til en kontaktside og legg til et notat",
      },
      added: "Notatet er lagt til",
      inputs: {
        add_note: "Legg til et notat",
        options_hint: "(legg ved filer eller endre detaljer)",
        show_options: "Vis alternativer",
      },
      actions: {
        attach_document: "Legg ved dokument",
      },
      validation: {
        note_or_attachment_required: "Et notat eller et vedlegg er påkrevd",
      },
    },
    sales: {
      name: "Bruker |||| Brukere",
      fields: {
        first_name: "Fornavn",
        last_name: "Etternavn",
        email: "E-post",
        administrator: "Administrator",
        disabled: "Deaktivert",
      },
      create: {
        error: "Det oppstod en feil ved oppretting av brukeren.",
        success:
          "Brukeren er opprettet og mottar snart en e-post for å angi passord.",
        title: "Opprett en ny bruker",
      },
      edit: {
        error: "Det oppstod en feil. Prøv igjen.",
        record_not_found: "Oppføringen ble ikke funnet",
        success: "Brukeren er oppdatert",
        title: "Rediger %{name}",
      },
      action: {
        new: "Ny bruker",
      },
    },
    tasks: {
      name: "Oppgave |||| Oppgaver",
      forcedCaseName: "Oppgave",
      fields: {
        text: "Beskrivelse",
        due_date: "Frist",
        type: "Type",
        contact_id: "Kontakt",
        due_short: "frist",
      },
      action: {
        add: "Legg til oppgave",
        create: "Opprett oppgave",
        edit: "Rediger oppgave",
      },
      actions: {
        postpone_next_week: "Utsett til neste uke",
        postpone_tomorrow: "Utsett til i morgen",
        title: "Oppgavehandlinger",
      },
      added: "Oppgaven er lagt til",
      deleted: "Oppgaven er slettet",
      dialog: {
        create: "Opprett oppgave",
        create_for: "Opprett oppgave for %{name}",
      },
      sheet: {
        edit: "Rediger oppgave",
        edit_for: "Rediger oppgave for %{name}",
      },
      empty: "Ingen oppgaver ennå",
      empty_list_hint: "Oppgaver som er lagt til kontaktene dine, vises her.",
      filters: {
        later: "Senere",
        overdue: "Forfalt",
        this_week: "Denne uken",
        today: "I dag",
        tomorrow: "I morgen",
        with_pending: "Med utestående oppgaver",
      },
      regarding_contact: "(Vedr.: %{name})",
      updated: "Oppgaven er oppdatert",
    },
    tags: {
      name: "Etikett |||| Etiketter",
      action: {
        add: "Legg til etikett",
        create: "Opprett ny etikett",
      },
      dialog: {
        color: "Farge",
        create_title: "Opprett en ny etikett",
        edit_title: "Rediger etikett",
        name_label: "Etikettnavn",
        name_placeholder: "Skriv inn etikettnavn",
      },
    },
  },
  crm: {
    action: {
      reset_password: "Tilbakestill passord",
    },
    auth: {
      first_name: "Fornavn",
      last_name: "Etternavn",
      confirm_password: "Bekreft passord",
      confirmation_required:
        "Følg lenken vi nettopp sendte deg på e-post for å bekrefte kontoen din.",
      recovery_email_sent:
        "Hvis du er registrert som bruker, mottar du snart en e-post for å tilbakestille passordet.",
      sign_in_failed: "Kunne ikke logge inn.",
      sign_in_google_workspace: "Logg inn med Google Workspace",
      signup: {
        create_account: "Opprett konto",
        create_first_user:
          "Opprett den første brukerkontoen for å fullføre oppsettet.",
        creating: "Oppretter...",
        initial_user_created: "Den første brukeren er opprettet",
      },
      welcome_title: "Velkommen til UpTextCrm",
    },
    common: {
      activity: "Aktivitet",
      added: "lagt til",
      details: "Detaljer",
      last_activity_with_date: "siste aktivitet %{date}",
      load_more: "Last inn flere",
      misc: "Annet",
      past: "Tidligere",
      read_more: "Les mer",
      retry: "Prøv igjen",
      show_less: "Vis mindre",
      copied: "Kopiert!",
      copy: "Kopier",
      loading: "Laster...",
      me: "Meg",
      task_count: "%{smart_count} oppgave |||| %{smart_count} oppgaver",
    },
    changelog: {
      title: "Endringslogg",
    },
    activity: {
      added_company: "%{name} la til bedriften",
      you_added_company: "Du la til bedriften",
      added_contact: "%{name} la til",
      you_added_contact: "Du la til",
      added_note: "%{name} la til et notat om",
      you_added_note: "Du la til et notat om",
      added_note_about_deal: "%{name} la til et notat om salgsmuligheten",
      you_added_note_about_deal: "Du la til et notat om salgsmuligheten",
      added_deal: "%{name} la til salgsmuligheten",
      you_added_deal: "Du la til salgsmuligheten",
      at_company: "hos",
      to: "til",
      load_more: "Last inn mer aktivitet",
    },
    dashboard: {
      sqlwebapi_description:
        "er et komplett CRM-system med SQL Server som database.",
      deals_chart: "Forventede salgsinntekter",
      deals_pipeline: "Salgspipeline",
      latest_activity: "Siste aktivitet",
      latest_activity_error: "Feil ved lasting av siste aktivitet",
      latest_notes: "Mine siste notater",
      latest_notes_added_ago: "lagt til %{timeAgo}",
      stepper: {
        install: "Installer UpTextCrm",
        progress: "%{step}/3 fullført",
        whats_next: "Hva er neste steg?",
      },
      upcoming_tasks: "Kommende oppgaver",
    },
    header: {
      import_data: "Importer data",
    },
    image_editor: {
      change: "Endre",
      drop_hint: "Slipp en fil for å laste opp, eller klikk for å velge den.",
      editable_content: "Redigerbart innhold",
      title: "Last opp og endre bildestørrelse",
      update_image: "Oppdater bilde",
    },
    import: {
      action: {
        download_error_report: "Last ned feilrapporten",
        export: "Eksporter",
        import: "Importer",
        import_another: "Importer en annen fil",
      },
      error: {
        unable: "Kunne ikke importere filen.",
        unable_export: "Kunne ikke eksportere data.",
      },
      idle: {
        description_1:
          "Du kan importere brukere, bedrifter, kontakter, notater og oppgaver.",
        description_2:
          "Dataene må være i en JSON-fil som følger dette eksemplet:",
        description_3:
          "Du kan også eksportere gjeldende datasett som en JSON-fil som kan importeres.",
      },
      status: {
        all_success: "Alle oppføringene ble importert.",
        complete: "Importen er fullført.",
        export_complete: "Eksporten er fullført.",
        failed: "Mislyktes",
        imported: "Importert",
        in_progress: "Importen pågår. Ikke forlat denne siden.",
        some_failed: "Noen oppføringer ble ikke importert.",
        table_caption: "Importstatus",
      },
      title: "Importer data",
    },
    settings: {
      about: "Om",
      companies: {
        sectors: "Bransjer",
      },
      dark_mode_logo: "Logo for mørkt tema",
      deals: {
        categories: "Kategorier",
        currency: "Valuta",
        pipeline_help:
          "Velg hvilke salgsfaser som skal inngå i salgspipelinen.",
        pipeline_statuses: "Pipelinestatuser",
        stages: "Faser",
      },
      light_mode_logo: "Logo for lyst tema",
      notes: {
        statuses: "Statuser",
      },
      reset_defaults: "Tilbakestill til standardverdier",
      save_error: "Kunne ikke lagre innstillingene",
      saved: "Innstillingene er lagret",
      saving: "Lagrer...",
      tasks: {
        types: "Typer",
      },
      preferences: "Preferanser",
      title: "Innstillinger",
      app_title: "Appnavn",
      sections: {
        branding: "Profilering",
      },
      validation: {
        duplicate: "Duplikat av %{display_name}: %{items}",
        in_use:
          "Kan ikke fjerne %{display_name} som fortsatt brukes av salgsmuligheter: %{items}",
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
    language: "Språk",
    navigation: {
      label: "CRM-navigasjon",
    },
    profile: {
      inbound: {
        description:
          "Du kan sende e-post til serverens innkommende e-postadresse, for eksempel ved å legge den til i feltet %{field}. UpTextCrm behandler e-postene og legger til notater på de tilhørende kontaktene.",
        title: "Innkommende e-post",
      },
      mcp: {
        title: "MCP-server",
        description:
          "Bruk denne URL-en for å koble KI-assistenten din til CRM-dataene dine via Model Context Protocol (MCP).",
      },
      password: {
        enter_new: "Skriv inn et nytt passord",
        empty: "Passordet kan ikke være tomt",
        update_error: "Kunne ikke oppdatere passordet",
        change: "Endre passord",
      },
      password_updated: "Passordet er oppdatert",
      password_reset_sent:
        "En e-post for tilbakestilling av passord er sendt til e-postadressen din",
      record_not_found: "Oppføringen ble ikke funnet",
      title: "Profil",
      updated: "Profilen din er oppdatert",
      update_error: "Det oppstod en feil. Prøv igjen",
    },
    validation: {
      invalid_url: "Må være en gyldig URL",
      invalid_linkedin_url: "URL-en må være fra linkedin.com",
    },
  },
} satisfies CrmMessages;
