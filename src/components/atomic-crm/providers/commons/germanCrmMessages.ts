import type { CrmMessages } from "./englishCrmMessages";

export const germanCrmMessages = {
  resources: {
    companies: {
      name: "Unternehmen |||| Unternehmen",
      forcedCaseName: "Unternehmen",
      fields: {
        name: "Unternehmensname",
        website: "Website",
        linkedin_url: "LinkedIn-URL",
        phone_number: "Telefonnummer",
        created_at: "Erstellt am",
        nb_contacts: "Anzahl der Kontakte",
        revenue: "Umsatz",
        sector: "Branche",
        size: "Größe",
        tax_identifier: "Steuerkennzeichen",
        address: "Adresse",
        city: "Ort",
        zipcode: "Postleitzahl",
        state_abbr: "Bundesland",
        country: "Land",
        description: "Beschreibung",
        context_links: "Kontextlinks",
        sales_id: "Kundenbetreuung",
      },
      empty: {
        description: "Ihre Unternehmensliste ist leer.",
        title: "Keine Unternehmen gefunden",
      },
      field_categories: {
        contact: "Kontakt",
        additional_info: "Weitere Informationen",
        address: "Adresse",
        context: "Kontext",
      },
      action: {
        create: "Unternehmen erstellen",
        edit: "Unternehmen bearbeiten",
        new: "Neues Unternehmen",
        show: "Unternehmen anzeigen",
      },
      added_on: "Hinzugefügt am %{date}",
      followed_by: "Betreut von %{name}",
      followed_by_you: "Von Ihnen betreut",
      no_contacts: "Keine Kontakte",
      nb_contacts: "%{smart_count} Kontakt |||| %{smart_count} Kontakte",
      nb_deals:
        "%{smart_count} Verkaufschance |||| %{smart_count} Verkaufschancen",
      sizes: {
        one_employee: "1 Mitarbeiter",
        two_to_nine_employees: "2–9 Mitarbeiter",
        ten_to_forty_nine_employees: "10–49 Mitarbeiter",
        fifty_to_two_hundred_forty_nine_employees: "50–249 Mitarbeiter",
        two_hundred_fifty_or_more_employees: "250 oder mehr Mitarbeiter",
      },
      autocomplete: {
        create_error:
          "Beim Erstellen des Unternehmens ist ein Fehler aufgetreten",
        create_item: "%{item} erstellen",
        create_label:
          "Beginnen Sie mit der Eingabe, um ein neues Unternehmen zu erstellen",
      },
      filters: {
        only_mine: "Nur von mir betreute Unternehmen",
      },
    },
    contacts: {
      name: "Kontakt |||| Kontakte",
      forcedCaseName: "Kontakt",
      field_categories: {
        background_info: "Hintergrundinformationen",
        identity: "Identität",
        misc: "Sonstiges",
        personal_info: "Persönliche Angaben",
        position: "Position",
      },
      fields: {
        first_name: "Vorname",
        last_name: "Nachname",
        last_seen: "Zuletzt gesehen",
        title: "Titel",
        company_id: "Unternehmen",
        email_jsonb: "E-Mail-Adressen",
        email: "E-Mail",
        phone_jsonb: "Telefonnummern",
        phone_number: "Telefonnummer",
        linkedin_url: "LinkedIn-URL",
        background: "Hintergrundinformationen (Biografie, Kennenlernen usw.)",
        has_newsletter: "Erhält Newsletter",
        sales_id: "Kundenbetreuung",
      },
      action: {
        add: "Kontakt hinzufügen",
        add_first: "Ersten Kontakt hinzufügen",
        create: "Kontakt erstellen",
        edit: "Kontakt bearbeiten",
        export_vcard: "Als vCard exportieren",
        new: "Neuer Kontakt",
        show: "Kontakt anzeigen",
      },
      background: {
        last_activity_on: "Letzte Aktivität am %{date}",
        added_on: "Hinzugefügt am %{date}",
        followed_by: "Betreut von %{name}",
        followed_by_you: "Von Ihnen betreut",
        status_none: "Keine",
      },
      position_at: "%{title} bei",
      position_at_company: "%{title} bei %{company}",
      empty: {
        description: "Ihre Kontaktliste ist leer.",
        title: "Keine Kontakte gefunden",
      },
      import: {
        title: "Kontakte importieren",
        button: "CSV importieren",
        complete:
          "Kontaktimport abgeschlossen. %{importCount} Kontakte importiert, mit %{errorCount} Fehlern",
        progress:
          "%{importCount} / %{rowCount} Kontakte importiert, mit %{errorCount} Fehlern.",
        error:
          "Die Datei konnte nicht importiert werden. Bitte wählen Sie eine gültige CSV-Datei.",
        imported: "Importiert",
        remaining_time: "Geschätzte verbleibende Zeit:",
        running: "Der Import läuft. Bitte schließen Sie diesen Tab nicht.",
        sample_download: "CSV-Beispiel herunterladen",
        sample_hint:
          "Hier finden Sie eine CSV-Beispieldatei, die Sie als Vorlage verwenden können",
        stop: "Import stoppen",
        csv_file: "CSV-Datei",
        contacts_label: "Kontakt |||| Kontakte",
      },
      inputs: {
        genders: {
          male: "Er/ihm",
          female: "Sie/ihr",
          nonbinary: "Geschlechtsneutral",
        },
        personal_info_types: {
          work: "Arbeit",
          home: "Privat",
          other: "Sonstiges",
        },
      },
      list: {
        error_loading: "Fehler beim Laden der Kontakte",
      },
      bulk_tag: {
        action: "Schlagwort",
        back: "Zurück zu den Schlagwörtern",
        create_description:
          "Erstellen Sie ein neues Schlagwort und weisen Sie es den ausgewählten Kontakten zu.",
        description:
          "Wählen Sie ein vorhandenes Schlagwort oder erstellen Sie ein neues für die ausgewählten Kontakte.",
        empty:
          "Noch keine Schlagwörter. Erstellen Sie eines für die ausgewählten Kontakte.",
        error: "Das Schlagwort konnte den Kontakten nicht zugewiesen werden",
        noop: "Die ausgewählten Kontakte haben dieses Schlagwort bereits",
        success:
          "Schlagwort %{smart_count} Kontakt zugewiesen |||| Schlagwort %{smart_count} Kontakten zugewiesen",
        title: "Kontakten ein Schlagwort zuweisen",
      },
      merge: {
        action: "Mit einem anderen Kontakt zusammenführen",
        confirm: "Kontakte zusammenführen",
        current_contact: "Aktueller Kontakt (wird gelöscht)",
        description: "Führen Sie diesen Kontakt mit einem anderen zusammen.",
        error: "Kontakte konnten nicht zusammengeführt werden",
        merging: "Zusammenführung läuft...",
        no_additional_data: "Keine weiteren Daten zum Zusammenführen",
        select_target: "Bitte wählen Sie einen Kontakt zum Zusammenführen",
        success: "Kontakte erfolgreich zusammengeführt",
        target_contact: "Zielkontakt (bleibt erhalten)",
        title: "Kontakt zusammenführen",
        warning_description:
          "Alle Daten werden auf den zweiten Kontakt übertragen. Diese Aktion kann nicht rückgängig gemacht werden.",
        warning_title: "Warnung: Unwiderrufliche Aktion",
        what_will_be_merged: "Diese Daten werden zusammengeführt:",
      },
      filters: {
        before_last_month: "Vor dem letzten Monat",
        before_this_month: "Vor diesem Monat",
        before_this_week: "Vor dieser Woche",
        managed_by_me: "Von mir betreut",
        search: "Name, Unternehmen suchen...",
        this_week: "Diese Woche",
        today: "Heute",
        tags: "Schlagwörter",
        tasks: "Aufgaben",
      },
      hot: {
        empty_change_status:
          "Ändern Sie den Status eines Kontakts, indem Sie eine Notiz hinzufügen und auf „Optionen anzeigen“ klicken.",
        empty_hint: "Kontakte mit dem Status „hot“ erscheinen hier.",
        title: "Heiße Kontakte",
      },
    },
    deals: {
      name: "Verkaufschance |||| Verkaufschancen",
      fields: {
        name: "Name",
        description: "Beschreibung",
        company_id: "Unternehmen",
        contact_ids: "Kontakte",
        category: "Kategorie",
        amount: "Budget",
        expected_closing_date: "Voraussichtliches Abschlussdatum",
        stage: "Phase",
      },
      action: {
        back_to_deal: "Zurück zur Verkaufschance",
        create: "Verkaufschance erstellen",
        new: "Neue Verkaufschance",
      },
      field_categories: {
        misc: "Sonstiges",
      },
      archived: {
        action: "Archivieren",
        error: "Fehler: Verkaufschance nicht archiviert",
        list_title: "Archivierte Verkaufschancen",
        success: "Verkaufschance archiviert",
        title: "Archivierte Verkaufschance",
        view: "Archivierte Verkaufschancen anzeigen",
      },
      inputs: {
        linked_to: "Verknüpft mit",
      },
      unarchived: {
        action: "Zurück auf das Board verschieben",
        error: "Fehler: Verkaufschance nicht wiederhergestellt",
        success: "Verkaufschance wiederhergestellt",
      },
      updated: "Verkaufschance aktualisiert",
      empty: {
        before_create: "bevor Sie eine Verkaufschance erstellen.",
        description: "Ihre Liste der Verkaufschancen ist leer.",
        title: "Keine Verkaufschancen gefunden",
      },
      invalid_date: "Ungültiges Datum",
    },
    tenants: {
      name: "Mandant |||| Mandanten",
      fields: {
        name: "Mandant",
        display_name: "Anzeigename",
        active: "Aktiv",
        activated_at: "Aktiviert am",
        deactivated_at: "Deaktiviert am",
        created_at: "Erstellt am",
        admin_email: "Administrator-E-Mail",
        password: "Administratorpasswort",
      },
      action: {
        create: "Mandanten erstellen",
        edit: "Mandanten bearbeiten",
        new: "Neuer Mandant",
      },
    },
    notes: {
      name: "Notiz |||| Notizen",
      forcedCaseName: "Notiz",
      fields: {
        status: "Status",
        date: "Datum",
        attachments: "Anhänge",
        contact_id: "Kontakt",
        deal_id: "Verkaufschance",
      },
      action: {
        add: "Notiz hinzufügen",
        add_first: "Erste Notiz hinzufügen",
        delete: "Notiz löschen",
        edit: "Notiz bearbeiten",
        update: "Notiz aktualisieren",
        add_this: "Diese Notiz hinzufügen",
      },
      sheet: {
        create: "Notiz erstellen",
        create_for: "Notiz für %{name} erstellen",
        edit: "Notiz bearbeiten",
        edit_for: "Notiz für %{name} bearbeiten",
      },
      deleted: "Notiz gelöscht",
      empty: "Noch keine Notizen",
      author_added: "%{name} hat eine Notiz hinzugefügt",
      you_added: "Sie haben eine Notiz hinzugefügt",
      me: "Ich",
      list: {
        error_loading: "Fehler beim Laden der Notizen",
      },
      note_for_contact: "Notiz für %{name}",
      stepper: {
        hint: "Öffnen Sie eine Kontaktseite und fügen Sie eine Notiz hinzu",
      },
      added: "Notiz hinzugefügt",
      inputs: {
        add_note: "Eine Notiz hinzufügen",
        options_hint: "(Dateien anhängen oder Details ändern)",
        show_options: "Optionen anzeigen",
      },
      actions: {
        attach_document: "Dokument anhängen",
      },
      validation: {
        note_or_attachment_required:
          "Eine Notiz oder ein Anhang ist erforderlich",
      },
    },
    sales: {
      name: "Benutzer |||| Benutzer",
      fields: {
        first_name: "Vorname",
        last_name: "Nachname",
        email: "E-Mail",
        administrator: "Administrator",
        disabled: "Deaktiviert",
      },
      create: {
        error: "Beim Erstellen des Benutzers ist ein Fehler aufgetreten.",
        success:
          "Benutzer erstellt. Er erhält in Kürze eine E-Mail zum Festlegen seines Passworts.",
        title: "Neuen Benutzer erstellen",
      },
      edit: {
        error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        record_not_found: "Datensatz nicht gefunden",
        success: "Benutzer erfolgreich aktualisiert",
        title: "%{name} bearbeiten",
      },
      action: {
        new: "Neuer Benutzer",
      },
    },
    tasks: {
      name: "Aufgabe |||| Aufgaben",
      forcedCaseName: "Aufgabe",
      fields: {
        text: "Beschreibung",
        due_date: "Fälligkeitsdatum",
        type: "Typ",
        contact_id: "Kontakt",
        due_short: "fällig",
      },
      action: {
        add: "Aufgabe hinzufügen",
        create: "Aufgabe erstellen",
        edit: "Aufgabe bearbeiten",
      },
      actions: {
        postpone_next_week: "Auf nächste Woche verschieben",
        postpone_tomorrow: "Auf morgen verschieben",
        title: "Aufgabenaktionen",
      },
      added: "Aufgabe hinzugefügt",
      deleted: "Aufgabe erfolgreich gelöscht",
      dialog: {
        create: "Aufgabe erstellen",
        create_for: "Aufgabe für %{name} erstellen",
      },
      sheet: {
        edit: "Aufgabe bearbeiten",
        edit_for: "Aufgabe für %{name} bearbeiten",
      },
      empty: "Noch keine Aufgaben",
      empty_list_hint:
        "Aufgaben, die Sie Ihren Kontakten hinzufügen, erscheinen hier.",
      filters: {
        later: "Später",
        overdue: "Überfällig",
        this_week: "Diese Woche",
        today: "Heute",
        tomorrow: "Morgen",
        with_pending: "Mit offenen Aufgaben",
      },
      regarding_contact: "(Betr.: %{name})",
      updated: "Aufgabe aktualisiert",
    },
    tags: {
      name: "Schlagwort |||| Schlagwörter",
      action: {
        add: "Schlagwort hinzufügen",
        create: "Neues Schlagwort erstellen",
      },
      dialog: {
        color: "Farbe",
        create_title: "Ein neues Schlagwort erstellen",
        edit_title: "Schlagwort bearbeiten",
        name_label: "Schlagwortname",
        name_placeholder: "Schlagwortnamen eingeben",
      },
    },
  },
  crm: {
    action: {
      reset_password: "Passwort zurücksetzen",
    },
    auth: {
      first_name: "Vorname",
      last_name: "Nachname",
      confirm_password: "Passwort bestätigen",
      confirmation_required:
        "Bitte folgen Sie dem Link, den wir Ihnen gerade per E-Mail gesendet haben, um Ihr Konto zu bestätigen.",
      recovery_email_sent:
        "Wenn Sie registriert sind, erhalten Sie in Kürze eine E-Mail zum Zurücksetzen Ihres Passworts.",
      sign_in_failed: "Anmeldung fehlgeschlagen.",
      sign_in_google_workspace: "Mit Google Workspace anmelden",
      signup: {
        create_account: "Konto erstellen",
        create_first_user:
          "Erstellen Sie das erste Benutzerkonto, um die Einrichtung abzuschließen.",
        creating: "Wird erstellt...",
        initial_user_created: "Erster Benutzer erfolgreich erstellt",
      },
      welcome_title: "Willkommen bei UpTextCrm",
    },
    common: {
      activity: "Aktivität",
      added: "hinzugefügt",
      details: "Details",
      last_activity_with_date: "letzte Aktivität %{date}",
      load_more: "Mehr laden",
      misc: "Sonstiges",
      past: "Vergangen",
      read_more: "Mehr lesen",
      retry: "Erneut versuchen",
      show_less: "Weniger anzeigen",
      copied: "Kopiert!",
      copy: "Kopieren",
      loading: "Wird geladen...",
      me: "Ich",
      task_count: "%{smart_count} Aufgabe |||| %{smart_count} Aufgaben",
    },
    changelog: {
      title: "Änderungsprotokoll",
    },
    activity: {
      added_company: "%{name} hat folgendes Unternehmen hinzugefügt:",
      you_added_company: "Sie haben folgendes Unternehmen hinzugefügt:",
      added_contact: "%{name} hat Folgendes hinzugefügt:",
      you_added_contact: "Sie haben Folgendes hinzugefügt:",
      added_note: "%{name} hat eine Notiz hinzugefügt zu",
      you_added_note: "Sie haben eine Notiz hinzugefügt zu",
      added_note_about_deal:
        "%{name} hat eine Notiz zu folgender Verkaufschance hinzugefügt:",
      you_added_note_about_deal:
        "Sie haben eine Notiz zu folgender Verkaufschance hinzugefügt:",
      added_deal: "%{name} hat folgende Verkaufschance hinzugefügt:",
      you_added_deal: "Sie haben folgende Verkaufschance hinzugefügt:",
      at_company: "bei",
      to: "zu",
      load_more: "Weitere Aktivitäten laden",
    },
    dashboard: {
      sqlwebapi_description:
        "ist ein vollständiges CRM-System mit SQL Server als Datenbank.",
      deals_chart: "Erwartete Verkaufserlöse",
      deals_pipeline: "Vertriebspipeline",
      latest_activity: "Letzte Aktivität",
      latest_activity_error: "Fehler beim Laden der letzten Aktivität",
      latest_notes: "Meine neuesten Notizen",
      latest_notes_added_ago: "hinzugefügt %{timeAgo}",
      stepper: {
        install: "UpTextCrm installieren",
        progress: "%{step}/3 erledigt",
        whats_next: "Wie geht es weiter?",
      },
      upcoming_tasks: "Anstehende Aufgaben",
    },
    header: {
      import_data: "Daten importieren",
    },
    image_editor: {
      change: "Ändern",
      drop_hint:
        "Datei zum Hochladen hierher ziehen oder zum Auswählen klicken.",
      editable_content: "Bearbeitbarer Inhalt",
      title: "Bild hochladen und Größe ändern",
      update_image: "Bild aktualisieren",
    },
    import: {
      action: {
        download_error_report: "Fehlerbericht herunterladen",
        export: "Exportieren",
        import: "Importieren",
        import_another: "Weitere Datei importieren",
      },
      error: {
        unable: "Diese Datei konnte nicht importiert werden.",
        unable_export: "Daten konnten nicht exportiert werden.",
      },
      idle: {
        description_1:
          "Sie können Benutzer, Unternehmen, Kontakte, Notizen und Aufgaben importieren.",
        description_2:
          "Die Daten müssen in einer JSON-Datei vorliegen, die folgendem Beispiel entspricht:",
        description_3:
          "Sie können den aktuellen Datenbestand auch als importierbare JSON-Datei exportieren.",
      },
      status: {
        all_success: "Alle Datensätze wurden erfolgreich importiert.",
        complete: "Import abgeschlossen.",
        export_complete: "Export abgeschlossen.",
        failed: "Fehlgeschlagen",
        imported: "Importiert",
        in_progress: "Der Import läuft. Bitte verlassen Sie diese Seite nicht.",
        some_failed: "Einige Datensätze wurden nicht importiert.",
        table_caption: "Importstatus",
      },
      title: "Daten importieren",
    },
    settings: {
      about: "Über",
      companies: {
        sectors: "Branchen",
      },
      dark_mode_logo: "Logo für dunkles Design",
      deals: {
        categories: "Kategorien",
        currency: "Währung",
        pipeline_help:
          "Wählen Sie die Verkaufsphasen aus, die in der Vertriebspipeline berücksichtigt werden sollen.",
        pipeline_statuses: "Pipeline-Status",
        stages: "Phasen",
      },
      light_mode_logo: "Logo für helles Design",
      notes: {
        statuses: "Status",
      },
      reset_defaults: "Auf Standardwerte zurücksetzen",
      save_error: "Einstellungen konnten nicht gespeichert werden",
      saved: "Einstellungen erfolgreich gespeichert",
      saving: "Wird gespeichert...",
      tasks: {
        types: "Typen",
      },
      preferences: "Präferenzen",
      title: "Einstellungen",
      app_title: "App-Titel",
      sections: {
        branding: "Markenauftritt",
      },
      validation: {
        duplicate: "Doppelte %{display_name}: %{items}",
        in_use:
          "%{display_name} können nicht entfernt werden, da sie noch von Verkaufschancen verwendet werden: %{items}",
        validating: "Wird geprüft…",
        entities: {
          categories: "Kategorien",
          stages: "Phasen",
        },
      },
    },
    theme: {
      dark: "Dunkel",
      label: "Design",
      light: "Hell",
      system: "System",
    },
    language: "Sprache",
    navigation: {
      label: "CRM-Navigation",
    },
    profile: {
      inbound: {
        description:
          "Sie können E-Mails an die Eingangsadresse Ihres Servers senden, etwa indem Sie diese im Feld %{field} eintragen. UpTextCrm verarbeitet die E-Mails und fügt den entsprechenden Kontakten Notizen hinzu.",
        title: "Eingehende E-Mails",
      },
      mcp: {
        title: "MCP-Server",
        description:
          "Verwenden Sie diese URL, um Ihren KI-Assistenten über das Model Context Protocol (MCP) mit Ihren CRM-Daten zu verbinden.",
      },
      password: {
        enter_new: "Geben Sie ein neues Passwort ein",
        empty: "Das Passwort darf nicht leer sein",
        update_error: "Das Passwort konnte nicht aktualisiert werden",
        change: "Passwort ändern",
      },
      password_updated: "Passwort erfolgreich aktualisiert",
      password_reset_sent:
        "Eine E-Mail zum Zurücksetzen des Passworts wurde an Ihre E-Mail-Adresse gesendet",
      record_not_found: "Datensatz nicht gefunden",
      title: "Profil",
      updated: "Ihr Profil wurde aktualisiert",
      update_error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut",
    },
    validation: {
      invalid_url: "Muss eine gültige URL sein",
      invalid_linkedin_url: "Die URL muss von linkedin.com stammen",
    },
  },
} satisfies CrmMessages;
