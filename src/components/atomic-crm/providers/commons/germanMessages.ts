import type { TranslationMessages } from "ra-core";
import type { raSupabaseEnglishMessages } from "ra-supabase-language-english";

export const germanAdminMessages = {
  ra: {
    action: {
      add_filter: "Filter hinzufügen",
      add: "Hinzufügen",
      back: "Zurück",
      bulk_actions:
        "1 Eintrag ausgewählt |||| %{smart_count} Einträge ausgewählt",
      cancel: "Abbrechen",
      clear_array_input: "Liste leeren",
      clear_input_value: "Wert löschen",
      clone: "Duplizieren",
      confirm: "Bestätigen",
      create: "Erstellen",
      create_item: "%{item} erstellen",
      delete: "Löschen",
      edit: "Bearbeiten",
      export: "Exportieren",
      list: "Liste",
      refresh: "Aktualisieren",
      remove_filter: "Diesen Filter entfernen",
      remove_all_filters: "Alle Filter entfernen",
      remove: "Entfernen",
      reset: "Zurücksetzen",
      save: "Speichern",
      search: "Suchen",
      search_columns: "Spalten suchen",
      select_all: "Alle auswählen",
      select_all_button: "Alle auswählen",
      select_row: "Diese Zeile auswählen",
      show: "Anzeigen",
      sort: "Sortieren",
      undo: "Rückgängig",
      unselect: "Auswahl aufheben",
      expand: "Erweitern",
      close: "Schließen",
      open_menu: "Menü öffnen",
      close_menu: "Menü schließen",
      update: "Aktualisieren",
      move_up: "Nach oben verschieben",
      move_down: "Nach unten verschieben",
      open: "Öffnen",
      toggle_theme: "Zwischen hellem und dunklem Design wechseln",
      select_columns: "Spalten",
      update_application: "Anwendung neu laden",
    },
    boolean: {
      true: "Ja",
      false: "Nein",
      null: " ",
    },
    page: {
      create: "%{name} erstellen",
      dashboard: "Übersicht",
      edit: "%{name} %{recordRepresentation}",
      error: "Etwas ist schiefgegangen",
      list: "%{name}",
      loading: "Wird geladen",
      not_found: "Nicht gefunden",
      show: "%{name} %{recordRepresentation}",
      empty: "Noch keine %{name}.",
      invite: "Möchten Sie einen Eintrag hinzufügen?",
      access_denied: "Zugriff verweigert",
      authentication_error: "Authentifizierungsfehler",
    },
    input: {
      file: {
        upload_several:
          "Dateien zum Hochladen hierher ziehen oder zum Auswählen klicken.",
        upload_single:
          "Datei zum Hochladen hierher ziehen oder zum Auswählen klicken.",
      },
      image: {
        upload_several:
          "Bilder zum Hochladen hierher ziehen oder zum Auswählen klicken.",
        upload_single:
          "Bild zum Hochladen hierher ziehen oder zum Auswählen klicken.",
      },
      references: {
        all_missing: "Referenzdaten konnten nicht gefunden werden.",
        many_missing:
          "Mindestens eine der verknüpften Referenzen ist nicht mehr verfügbar.",
        single_missing: "Die verknüpfte Referenz ist nicht mehr verfügbar.",
      },
      password: {
        toggle_visible: "Passwort verbergen",
        toggle_hidden: "Passwort anzeigen",
      },
    },
    message: {
      about: "Über",
      access_denied:
        "Sie haben keine Berechtigung, auf diese Seite zuzugreifen",
      are_you_sure: "Sind Sie sicher?",
      authentication_error:
        "Der Authentifizierungsserver hat einen Fehler zurückgegeben. Ihre Anmeldedaten konnten nicht überprüft werden.",
      auth_error:
        "Bei der Überprüfung des Authentifizierungstokens ist ein Fehler aufgetreten.",
      bulk_delete_content:
        "Möchten Sie diesen Eintrag (%{name}) wirklich löschen? |||| Möchten Sie diese %{smart_count} Einträge wirklich löschen?",
      bulk_delete_title: "%{name} löschen |||| %{smart_count} %{name} löschen",
      bulk_update_content:
        "Möchten Sie %{name} %{recordRepresentation} wirklich aktualisieren? |||| Möchten Sie diese %{smart_count} Einträge wirklich aktualisieren?",
      bulk_update_title:
        "%{name} %{recordRepresentation} aktualisieren |||| %{smart_count} %{name} aktualisieren",
      clear_array_input: "Möchten Sie wirklich die gesamte Liste leeren?",
      delete_content: "Möchten Sie diesen Eintrag (%{name}) wirklich löschen?",
      delete_title: "%{name} %{recordRepresentation} löschen",
      details: "Details",
      error:
        "Ein Clientfehler ist aufgetreten. Ihre Anfrage konnte nicht abgeschlossen werden.",
      invalid_form:
        "Das Formular enthält Fehler. Bitte überprüfen Sie die Eingaben",
      loading: "Bitte warten",
      no: "Nein",
      not_found:
        "Sie haben eine falsche URL eingegeben oder einen ungültigen Link geöffnet.",
      select_all_limit_reached:
        "Es gibt zu viele Einträge, um alle auszuwählen. Nur die ersten %{max} Einträge wurden ausgewählt.",
      unsaved_changes:
        "Einige Änderungen wurden nicht gespeichert. Möchten Sie diese wirklich verwerfen?",
      yes: "Ja",
      placeholder_data_warning:
        "Netzwerkproblem: Die Daten konnten nicht aktualisiert werden.",
    },
    navigation: {
      clear_filters: "Filter entfernen",
      no_filtered_results:
        "Mit den aktuellen Filtern wurden keine %{name} gefunden.",
      no_results: "Keine %{name} gefunden",
      no_more_results:
        "Seite %{page} liegt außerhalb des gültigen Bereichs. Versuchen Sie die vorherige Seite.",
      page_out_of_boundaries:
        "Seite %{page} liegt außerhalb des gültigen Bereichs",
      page_out_from_end: "Die letzte Seite kann nicht überschritten werden",
      page_out_from_begin: "Vor Seite 1 kann nicht zurückgeblättert werden",
      page_range_info: "%{offsetBegin}–%{offsetEnd} von %{total}",
      partial_page_range_info:
        "%{offsetBegin}–%{offsetEnd} von mehr als %{offsetEnd}",
      current_page: "Seite %{page}",
      page: "Zu Seite %{page}",
      first: "Zur ersten Seite",
      last: "Zur letzten Seite",
      next: "Zur nächsten Seite",
      previous: "Zur vorherigen Seite",
      page_rows_per_page: "Zeilen pro Seite:",
      skip_nav: "Zum Inhalt springen",
    },
    sort: {
      sort_by: "Nach %{field_lower_first} %{order} sortieren",
      ASC: "aufsteigend",
      DESC: "absteigend",
    },
    auth: {
      auth_check_error: "Bitte melden Sie sich an, um fortzufahren",
      user_menu: "Profil",
      username: "Benutzername",
      password: "Passwort",
      email: "E-Mail",
      sign_in: "Anmelden",
      sign_in_error: "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut",
      logout: "Abmelden",
    },
    notification: {
      updated: "Eintrag aktualisiert |||| %{smart_count} Einträge aktualisiert",
      created: "Eintrag erstellt",
      deleted: "Eintrag gelöscht |||| %{smart_count} Einträge gelöscht",
      bad_item: "Ungültiger Eintrag",
      item_doesnt_exist: "Der Eintrag existiert nicht",
      http_error: "Fehler bei der Kommunikation mit dem Server",
      data_provider_error:
        "Fehler im Datenprovider. Weitere Informationen finden Sie in der Konsole.",
      i18n_error:
        "Die Übersetzungen für die ausgewählte Sprache konnten nicht geladen werden",
      canceled: "Aktion abgebrochen",
      logged_out:
        "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
      not_authorized:
        "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen.",
      application_update_available: "Eine neue Version ist verfügbar.",
      offline:
        "Keine Netzwerkverbindung. Daten konnten nicht abgerufen werden.",
    },
    validation: {
      required: "Erforderlich",
      minLength: "Muss mindestens %{min} Zeichen enthalten",
      maxLength: "Darf höchstens %{max} Zeichen enthalten",
      minValue: "Muss mindestens %{min} sein",
      maxValue: "Darf höchstens %{max} sein",
      number: "Muss eine Zahl sein",
      email: "Muss eine gültige E-Mail-Adresse sein",
      oneOf: "Muss einer dieser Werte sein: %{options}",
      regex: "Muss diesem Format entsprechen (regulärer Ausdruck): %{pattern}",
      unique: "Muss eindeutig sein",
    },
    saved_queries: {
      label: "Gespeicherte Suchen",
      query_name: "Name der Suche",
      new_label: "Aktuelle Suche speichern...",
      new_dialog_title: "Aktuelle Suche speichern unter",
      remove_label: "Gespeicherte Suche entfernen",
      remove_label_with_name: "Suche „%{name}“ entfernen",
      remove_dialog_title: "Gespeicherte Suche entfernen?",
      remove_message:
        "Möchten Sie diese Suche wirklich aus der Liste der gespeicherten Suchen entfernen?",
      help: "Filtern Sie die Liste und speichern Sie die Suche für später",
    },
    configurable: {
      customize: "Anpassen",
      configureMode: "Diese Seite anpassen",
      inspector: {
        title: "Inspektor",
        content:
          "Bewegen Sie den Mauszeiger über die Oberflächenelemente, um sie anzupassen",
        reset: "Einstellungen zurücksetzen",
        hideAll: "Alle ausblenden",
        showAll: "Alle anzeigen",
      },
      Datagrid: {
        title: "Datentabelle",
        unlabeled: "Unbenannte Spalte #%{column}",
      },
      SimpleForm: {
        title: "Formular",
        unlabeled: "Unbenanntes Eingabefeld #%{input}",
      },
      SimpleList: {
        title: "Liste",
        primaryText: "Primärer Text",
        secondaryText: "Sekundärer Text",
        tertiaryText: "Tertiärer Text",
      },
    },
  },
} satisfies TranslationMessages;

export const germanSupabaseMessages = {
  "ra-supabase": {
    auth: {
      email: "E-Mail",
      confirm_password: "Passwort bestätigen",
      sign_in_with: "Mit %{provider} anmelden",
      forgot_password: "Passwort vergessen?",
      reset_password: "Passwort zurücksetzen",
      password_reset:
        "Prüfen Sie Ihr E-Mail-Postfach auf eine Nachricht mit einem Link zum Zurücksetzen Ihres Passworts.",
      missing_tokens: "Zugriffs- und Aktualisierungstoken fehlen",
      back_to_login: "Zurück zur Anmeldung",
    },
    reset_password: {
      forgot_password: "Passwort vergessen?",
      forgot_password_details:
        "Geben Sie Ihre E-Mail-Adresse ein, um Anweisungen zu erhalten.",
    },
    set_password: {
      new_password: "Passwort wählen",
    },
    validation: {
      password_mismatch: "Die Passwörter stimmen nicht überein",
    },
  },
} satisfies typeof raSupabaseEnglishMessages;
