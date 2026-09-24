import type { CrmMessages } from "./englishCrmMessages";

export const swedishCrmMessages = {
  resources: {
    companies: {
      name: "Företag |||| Företag",
      forcedCaseName: "Företag",
      fields: {
        name: "Företagsnamn",
        website: "Webbplats",
        linkedin_url: "LinkedIn-URL",
        phone_number: "Telefonnummer",
        created_at: "Skapad",
        nb_contacts: "Antal kontakter",
        revenue: "Omsättning",
        sector: "Bransch",
        size: "Storlek",
        tax_identifier: "Organisationsnummer",
        address: "Adress",
        city: "Ort",
        zipcode: "Postnummer",
        state_abbr: "Delstat",
        country: "Land",
        description: "Beskrivning",
        context_links: "Kontextlänkar",
        sales_id: "Kundansvarig",
      },
      empty: {
        description: "Din företagslista är tom.",
        title: "Inga företag hittades",
      },
      field_categories: {
        contact: "Kontakt",
        additional_info: "Ytterligare information",
        address: "Adress",
        context: "Kontext",
      },
      action: {
        create: "Skapa företag",
        edit: "Redigera företag",
        new: "Nytt företag",
        show: "Visa företag",
      },
      added_on: "Tillagd %{date}",
      followed_by: "Följs av %{name}",
      followed_by_you: "Följs av dig",
      no_contacts: "Inga kontakter",
      nb_contacts: "%{smart_count} kontakt |||| %{smart_count} kontakter",
      nb_deals: "%{smart_count} affär |||| %{smart_count} affärer",
      sizes: {
        one_employee: "1 anställd",
        two_to_nine_employees: "2–9 anställda",
        ten_to_forty_nine_employees: "10–49 anställda",
        fifty_to_two_hundred_forty_nine_employees: "50–249 anställda",
        two_hundred_fifty_or_more_employees: "250 eller fler anställda",
      },
      autocomplete: {
        create_error: "Ett fel uppstod när företaget skapades",
        create_item: "Skapa %{item}",
        create_label: "Börja skriva för att skapa ett nytt företag",
      },
      filters: {
        only_mine: "Bara företag jag ansvarar för",
      },
    },
    contacts: {
      name: "Kontakt |||| Kontakter",
      forcedCaseName: "Kontakt",
      field_categories: {
        background_info: "Bakgrundsinformation",
        identity: "Identitet",
        misc: "Övrigt",
        personal_info: "Personuppgifter",
        position: "Befattning",
      },
      fields: {
        first_name: "Förnamn",
        last_name: "Efternamn",
        last_seen: "Senast sedd",
        title: "Titel",
        company_id: "Företag",
        email_jsonb: "E-postadresser",
        email: "E-post",
        phone_jsonb: "Telefonnummer",
        phone_number: "Telefonnummer",
        linkedin_url: "LinkedIn-URL",
        background: "Bakgrundsinformation (biografi, hur ni träffades osv.)",
        has_newsletter: "Får nyhetsbrev",
        sales_id: "Kundansvarig",
      },
      action: {
        add: "Lägg till kontakt",
        add_first: "Lägg till din första kontakt",
        create: "Skapa kontakt",
        edit: "Redigera kontakt",
        export_vcard: "Exportera till vCard",
        new: "Ny kontakt",
        show: "Visa kontakt",
      },
      background: {
        last_activity_on: "Senaste aktivitet %{date}",
        added_on: "Tillagd %{date}",
        followed_by: "Följs av %{name}",
        followed_by_you: "Följs av dig",
        status_none: "Ingen",
      },
      position_at: "%{title} på",
      position_at_company: "%{title} på %{company}",
      empty: {
        description: "Din kontaktlista är tom.",
        title: "Inga kontakter hittades",
      },
      import: {
        title: "Importera kontakter",
        button: "Importera CSV",
        complete:
          "Kontaktimporten är klar. Importerade %{importCount} kontakter, med %{errorCount} fel",
        progress:
          "Importerade %{importCount} / %{rowCount} kontakter, med %{errorCount} fel.",
        error:
          "Kunde inte importera filen. Kontrollera att du har valt en giltig CSV-fil.",
        imported: "Importerade",
        remaining_time: "Beräknad återstående tid:",
        running: "Importen pågår. Stäng inte den här fliken.",
        sample_download: "Ladda ner CSV-exempel",
        sample_hint: "Här är en CSV-exempelfil som du kan använda som mall",
        stop: "Stoppa import",
        csv_file: "CSV-fil",
        contacts_label: "kontakt |||| kontakter",
      },
      inputs: {
        genders: {
          male: "Han/honom",
          female: "Hon/henne",
          nonbinary: "Hen/hen",
        },
        personal_info_types: {
          work: "Arbete",
          home: "Hem",
          other: "Annat",
        },
      },
      list: {
        error_loading: "Fel vid inläsning av kontakter",
      },
      bulk_tag: {
        action: "Etikett",
        back: "Tillbaka till etiketter",
        create_description:
          "Skapa en ny etikett och lägg till den på de valda kontakterna.",
        description:
          "Välj en befintlig etikett eller skapa en ny för de valda kontakterna.",
        empty:
          "Inga etiketter ännu. Skapa en för att märka de valda kontakterna.",
        error: "Kunde inte lägga till etiketten på kontakterna",
        noop: "De valda kontakterna har redan den här etiketten",
        success:
          "Etikett tillagd på %{smart_count} kontakt |||| Etikett tillagd på %{smart_count} kontakter",
        title: "Lägg till etikett på kontakter",
      },
      merge: {
        action: "Slå ihop med en annan kontakt",
        confirm: "Slå ihop kontakter",
        current_contact: "Nuvarande kontakt (tas bort)",
        description: "Slå ihop den här kontakten med en annan.",
        error: "Kunde inte slå ihop kontakterna",
        merging: "Slår ihop...",
        no_additional_data: "Inga ytterligare data att slå ihop",
        select_target: "Välj en kontakt att slå ihop med",
        success: "Kontakterna har slagits ihop",
        target_contact: "Målkontakt (behålls)",
        title: "Slå ihop kontakt",
        warning_description:
          "Alla data överförs till den andra kontakten. Åtgärden kan inte ångras.",
        warning_title: "Varning: Åtgärden kan inte ångras",
        what_will_be_merged: "Det här slås ihop:",
      },
      filters: {
        before_last_month: "Före förra månaden",
        before_this_month: "Före den här månaden",
        before_this_week: "Före den här veckan",
        managed_by_me: "Jag är ansvarig",
        search: "Sök efter namn, företag...",
        this_week: "Den här veckan",
        today: "I dag",
        tags: "Etiketter",
        tasks: "Uppgifter",
      },
      hot: {
        empty_change_status:
          "Ändra status för en kontakt genom att lägga till en anteckning och klicka på ”Visa alternativ”.",
        empty_hint: "Kontakter med statusen ”hot” visas här.",
        title: "Heta kontakter",
      },
    },
    deals: {
      name: "Affär |||| Affärer",
      fields: {
        name: "Namn",
        description: "Beskrivning",
        company_id: "Företag",
        contact_ids: "Kontakter",
        category: "Kategori",
        amount: "Budget",
        expected_closing_date: "Förväntat avslutsdatum",
        stage: "Fas",
      },
      action: {
        back_to_deal: "Tillbaka till affären",
        create: "Skapa affär",
        new: "Ny affär",
      },
      field_categories: {
        misc: "Övrigt",
      },
      archived: {
        action: "Arkivera",
        error: "Fel: Affären arkiverades inte",
        list_title: "Arkiverade affärer",
        success: "Affären har arkiverats",
        title: "Arkiverad affär",
        view: "Visa arkiverade affärer",
      },
      inputs: {
        linked_to: "Kopplad till",
      },
      unarchived: {
        action: "Flytta tillbaka till tavlan",
        error: "Fel: Affären återställdes inte",
        success: "Affären har återställts",
      },
      updated: "Affären har uppdaterats",
      empty: {
        before_create: "innan du skapar en affär.",
        description: "Din affärslista är tom.",
        title: "Inga affärer hittades",
      },
      invalid_date: "Ogiltigt datum",
    },
    tenants: {
      name: "Organisation |||| Organisationer",
      fields: {
        name: "Organisation",
        display_name: "Visningsnamn",
        active: "Aktiv",
        activated_at: "Aktiverad",
        deactivated_at: "Inaktiverad",
        created_at: "Skapad",
        admin_email: "Administratörens e-post",
        password: "Administratörens lösenord",
      },
      action: {
        create: "Skapa organisation",
        edit: "Redigera organisation",
        new: "Ny organisation",
      },
    },
    notes: {
      name: "Anteckning |||| Anteckningar",
      forcedCaseName: "Anteckning",
      fields: {
        status: "Status",
        date: "Datum",
        attachments: "Bilagor",
        contact_id: "Kontakt",
        deal_id: "Affär",
      },
      action: {
        add: "Lägg till anteckning",
        add_first: "Lägg till din första anteckning",
        delete: "Ta bort anteckning",
        edit: "Redigera anteckning",
        update: "Uppdatera anteckning",
        add_this: "Lägg till den här anteckningen",
      },
      sheet: {
        create: "Skapa anteckning",
        create_for: "Skapa anteckning för %{name}",
        edit: "Redigera anteckning",
        edit_for: "Redigera anteckning för %{name}",
      },
      deleted: "Anteckningen har tagits bort",
      empty: "Inga anteckningar ännu",
      author_added: "%{name} lade till en anteckning",
      you_added: "Du lade till en anteckning",
      me: "Jag",
      list: {
        error_loading: "Fel vid inläsning av anteckningar",
      },
      note_for_contact: "Anteckning för %{name}",
      stepper: {
        hint: "Gå till en kontaktsida och lägg till en anteckning",
      },
      added: "Anteckningen har lagts till",
      inputs: {
        add_note: "Lägg till en anteckning",
        options_hint: "(bifoga filer eller ändra detaljer)",
        show_options: "Visa alternativ",
      },
      actions: {
        attach_document: "Bifoga dokument",
      },
      validation: {
        note_or_attachment_required: "En anteckning eller en bilaga krävs",
      },
    },
    sales: {
      name: "Användare |||| Användare",
      fields: {
        first_name: "Förnamn",
        last_name: "Efternamn",
        email: "E-post",
        administrator: "Administratör",
        disabled: "Inaktiverad",
      },
      create: {
        error: "Ett fel uppstod när användaren skapades.",
        success:
          "Användaren har skapats och får snart ett e-postmeddelande för att ange sitt lösenord.",
        title: "Skapa en ny användare",
      },
      edit: {
        error: "Ett fel uppstod. Försök igen.",
        record_not_found: "Posten hittades inte",
        success: "Användaren har uppdaterats",
        title: "Redigera %{name}",
      },
      action: {
        new: "Ny användare",
      },
    },
    tasks: {
      name: "Uppgift |||| Uppgifter",
      forcedCaseName: "Uppgift",
      fields: {
        text: "Beskrivning",
        due_date: "Förfallodatum",
        type: "Typ",
        contact_id: "Kontakt",
        due_short: "förfaller",
      },
      action: {
        add: "Lägg till uppgift",
        create: "Skapa uppgift",
        edit: "Redigera uppgift",
      },
      actions: {
        postpone_next_week: "Skjut upp till nästa vecka",
        postpone_tomorrow: "Skjut upp till i morgon",
        title: "Uppgiftsåtgärder",
      },
      added: "Uppgiften har lagts till",
      deleted: "Uppgiften har tagits bort",
      dialog: {
        create: "Skapa uppgift",
        create_for: "Skapa uppgift för %{name}",
      },
      sheet: {
        edit: "Redigera uppgift",
        edit_for: "Redigera uppgift för %{name}",
      },
      empty: "Inga uppgifter ännu",
      empty_list_hint: "Uppgifter som läggs till på dina kontakter visas här.",
      filters: {
        later: "Senare",
        overdue: "Försenade",
        this_week: "Den här veckan",
        today: "I dag",
        tomorrow: "I morgon",
        with_pending: "Med utestående uppgifter",
      },
      regarding_contact: "(Ang.: %{name})",
      updated: "Uppgiften har uppdaterats",
    },
    tags: {
      name: "Etikett |||| Etiketter",
      action: {
        add: "Lägg till etikett",
        create: "Skapa ny etikett",
      },
      dialog: {
        color: "Färg",
        create_title: "Skapa en ny etikett",
        edit_title: "Redigera etikett",
        name_label: "Etikettnamn",
        name_placeholder: "Ange etikettnamn",
      },
    },
  },
  crm: {
    action: {
      reset_password: "Återställ lösenord",
    },
    auth: {
      first_name: "Förnamn",
      last_name: "Efternamn",
      confirm_password: "Bekräfta lösenord",
      confirmation_required:
        "Följ länken vi just skickade via e-post för att bekräfta ditt konto.",
      recovery_email_sent:
        "Om du är registrerad får du snart ett e-postmeddelande för att återställa lösenordet.",
      sign_in_failed: "Kunde inte logga in.",
      sign_in_google_workspace: "Logga in med Google Workspace",
      signup: {
        create_account: "Skapa konto",
        create_first_user:
          "Skapa det första användarkontot för att slutföra installationen.",
        creating: "Skapar...",
        initial_user_created: "Den första användaren har skapats",
      },
      welcome_title: "Välkommen till UpTextCrm",
    },
    common: {
      activity: "Aktivitet",
      added: "tillagd",
      details: "Detaljer",
      last_activity_with_date: "senaste aktivitet %{date}",
      load_more: "Läs in fler",
      misc: "Övrigt",
      past: "Tidigare",
      read_more: "Läs mer",
      retry: "Försök igen",
      show_less: "Visa mindre",
      copied: "Kopierat!",
      copy: "Kopiera",
      loading: "Läser in...",
      me: "Jag",
      task_count: "%{smart_count} uppgift |||| %{smart_count} uppgifter",
    },
    changelog: {
      title: "Ändringslogg",
    },
    activity: {
      added_company: "%{name} lade till företaget",
      you_added_company: "Du lade till företaget",
      added_contact: "%{name} lade till",
      you_added_contact: "Du lade till",
      added_note: "%{name} lade till en anteckning om",
      you_added_note: "Du lade till en anteckning om",
      added_note_about_deal: "%{name} lade till en anteckning om affären",
      you_added_note_about_deal: "Du lade till en anteckning om affären",
      added_deal: "%{name} lade till affären",
      you_added_deal: "Du lade till affären",
      at_company: "på",
      to: "till",
      load_more: "Läs in mer aktivitet",
    },
    dashboard: {
      sqlwebapi_description:
        "är ett komplett CRM-system med SQL Server som databas.",
      deals_chart: "Förväntade försäljningsintäkter",
      deals_pipeline: "Försäljningspipeline",
      latest_activity: "Senaste aktivitet",
      latest_activity_error: "Fel vid inläsning av senaste aktivitet",
      latest_notes: "Mina senaste anteckningar",
      latest_notes_added_ago: "tillagd %{timeAgo}",
      stepper: {
        install: "Installera UpTextCrm",
        progress: "%{step}/3 klart",
        whats_next: "Vad är nästa steg?",
      },
      upcoming_tasks: "Kommande uppgifter",
    },
    header: {
      import_data: "Importera data",
    },
    image_editor: {
      change: "Ändra",
      drop_hint:
        "Släpp en fil för att ladda upp, eller klicka för att välja den.",
      editable_content: "Redigerbart innehåll",
      title: "Ladda upp och ändra bildstorlek",
      update_image: "Uppdatera bild",
    },
    import: {
      action: {
        download_error_report: "Ladda ner felrapporten",
        export: "Exportera",
        import: "Importera",
        import_another: "Importera en annan fil",
      },
      error: {
        unable: "Kunde inte importera filen.",
        unable_export: "Kunde inte exportera data.",
      },
      idle: {
        description_1:
          "Du kan importera användare, företag, kontakter, anteckningar och uppgifter.",
        description_2:
          "Data måste finnas i en JSON-fil som följer det här exemplet:",
        description_3:
          "Du kan också exportera aktuella data som en JSON-fil som kan importeras.",
      },
      status: {
        all_success: "Alla poster har importerats.",
        complete: "Importen är klar.",
        export_complete: "Exporten är klar.",
        failed: "Misslyckades",
        imported: "Importerade",
        in_progress: "Importen pågår. Lämna inte den här sidan.",
        some_failed: "Vissa poster importerades inte.",
        table_caption: "Importstatus",
      },
      title: "Importera data",
    },
    settings: {
      about: "Om",
      companies: {
        sectors: "Branscher",
      },
      dark_mode_logo: "Logotyp för mörkt tema",
      deals: {
        categories: "Kategorier",
        currency: "Valuta",
        pipeline_help:
          "Välj vilka affärsfaser som ska ingå i försäljningspipelinen.",
        pipeline_statuses: "Pipelinestatusar",
        stages: "Faser",
      },
      light_mode_logo: "Logotyp för ljust tema",
      notes: {
        statuses: "Statusar",
      },
      reset_defaults: "Återställ standardvärden",
      save_error: "Kunde inte spara inställningarna",
      saved: "Inställningarna har sparats",
      saving: "Sparar...",
      tasks: {
        types: "Typer",
      },
      preferences: "Preferenser",
      title: "Inställningar",
      app_title: "Appnamn",
      sections: {
        branding: "Varumärke",
      },
      validation: {
        duplicate: "Dubblett av %{display_name}: %{items}",
        in_use:
          "Kan inte ta bort %{display_name} som fortfarande används av affärer: %{items}",
        validating: "Validerar…",
        entities: {
          categories: "kategorier",
          stages: "faser",
        },
      },
    },
    theme: {
      dark: "Mörkt",
      label: "Tema",
      light: "Ljust",
      system: "System",
    },
    language: "Språk",
    navigation: {
      label: "CRM-navigering",
    },
    profile: {
      inbound: {
        description:
          "Du kan skicka e-post till serverns inkommande e-postadress, till exempel genom att lägga till den i fältet %{field}. UpTextCrm behandlar meddelandena och lägger till anteckningar på motsvarande kontakter.",
        title: "Inkommande e-post",
      },
      mcp: {
        title: "MCP-server",
        description:
          "Använd den här URL:en för att ansluta din AI-assistent till dina CRM-data via Model Context Protocol (MCP).",
      },
      password: {
        enter_new: "Ange ett nytt lösenord",
        empty: "Lösenordet får inte vara tomt",
        update_error: "Kunde inte uppdatera lösenordet",
        change: "Ändra lösenord",
      },
      password_updated: "Lösenordet har uppdaterats",
      password_reset_sent:
        "Ett e-postmeddelande för återställning av lösenord har skickats till din e-postadress",
      record_not_found: "Posten hittades inte",
      title: "Profil",
      updated: "Din profil har uppdaterats",
      update_error: "Ett fel uppstod. Försök igen",
    },
    validation: {
      invalid_url: "Måste vara en giltig URL",
      invalid_linkedin_url: "URL:en måste vara från linkedin.com",
    },
  },
} satisfies CrmMessages;
