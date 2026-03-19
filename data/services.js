/**
 * ╔══════════════════════════════════════════════════╗
 * ║          CloudLab Dashboard — Konfiguration      ║
 * ║  Hier alle Dienste, Links und Hero-Texte pflegen ║
 * ╚══════════════════════════════════════════════════╝
 *
 * status:     "online" | "idle" | "offline"
 * container:  Name des Docker-Containers (für Live-Status-Abfrage)
 * icon:       beliebiges Lucide-Icon  → https://lucide.dev/icons/
 */

const DASHBOARD_CONFIG = {

  /* ── Docker-API ─────────────────────────────────── */
  api: {
    // Optional: eigene URL überschreiben. null = relativer Pfad /api/containers (Standard)
    dockerUrl: null,
  },

  /* ── Hero-Bereich ──────────────────────────────── */
  hero: {
    title:    'Mein persönliches',
    subtitle: 'CloudLab Dashboard.',
    description: 'Zentraler Überblick über alle laufenden Dienste, Tools und Ressourcen meines CloudLabs.',
    badge:    'Self-hosted · Cloud · Docker',
    network:  '192.168.x.x',
  },

  /* ── Footer ────────────────────────────────────── */
  footer: {
    label: 'CloudLab Dashboard — Made with ❤ by Lorenz',
  },

  /* ── Sektionen ─────────────────────────────────── */
  sections: [

    /* ── 1. Infrastruktur (Karten) ── */
    {
      id:    'infrastruktur',
      title: 'Infrastruktur',
      type:  'cards',
      items: [
        {
          name:      'Portainer',
          desc:      'Docker-Container verwalten, Images und Stacks übersichtlich im Browser.',
          icon:      'layout-dashboard',
          tag:       ':9000',
          url:       '/portainer',
          status:    'online',
          container: 'portainer',
        },
        {
          name:      'Nginx Proxy Manager',
          desc:      'Reverse-Proxy mit SSL-Terminierung, Hosts und Weiterleitungen.',
          icon:      'shield-check',
          tag:       ':81',
          url:       '130.61.227.197:81',           // ← direkte IP eintragen, sobald Proxy-Host gesetzt ist
          status:    'online',
          container: 'nginx-proxy-manager',
        },
        {
          name:      'Uptime Kuma',
          desc:      'Monitoring aller Dienste mit Benachrichtigungen und Status-Seite.',
          icon:      'activity',
          tag:       ':3001',
          url:       '#',
          status:    'offline',
          container: 'uptime-kuma',
        },
        {
          name:      'Dashdot',
          desc:      'Live-Systemmetriken: CPU, RAM, Festplatte und Netzwerk auf einen Blick.',
          icon:      'hard-drive',
          tag:       ':3000',
          url:       '#',
          status:    'offline',
          container: 'dashdot',
        },
      ],
    },

    /* ── 2. Dienste (Karten) ── */
    {
      id:    'dienste',
      title: 'Dienste',
      type:  'cards',
      items: [
        {
          name:      'Nextcloud',
          desc:      'Private Cloud für Dateien, Kalender, Kontakte und Kollaboration.',
          icon:      'cloud',
          tag:       'cloud',
          url:       '#',
          status:    'offline',
          container: 'nextcloud',
        },
        {
          name:      'Gitea',
          desc:      'Self-hosted Git-Server für Repositories, Issues und CI/CD-Pipelines.',
          icon:      'git-branch',
          tag:       'git',
          url:       '#',
          status:    'offline',
          container: 'gitea',
        },
        {
          name:      'Vaultwarden',
          desc:      'Passwort-Manager kompatibel mit Bitwarden — sicher und selbst verwaltet.',
          icon:      'shield',
          tag:       'vault',
          url:       '#',
          status:    'offline',
          container: 'vaultwarden',
        },
        {
          name:      'Jellyfin',
          desc:      'Media-Server für Filme, Serien und Musik — überall streambar.',
          icon:      'film',
          tag:       ':8096',
          url:       '#',
          status:    'offline',
          container: 'jellyfin',
        },
        {
          name:      'Outline',
          desc:      'Team-Wiki und Wissensdatenbank mit sauberem Editor und Versionierung.',
          icon:      'book-open',
          tag:       'wiki',
          url:       '#',
          status:    'offline',
          container: 'outline',
        },
        {
          name:      'OpenClaw',
          desc:      'Self-hosted KI-Assistent — verbindet Messaging-Apps mit KI-Modellen über 50+ Kanäle (WhatsApp, Telegram, Discord u.v.m.).',
          icon:      'bot',
          tag:       'ai',
          url:       '130.61.227.197:18789',
          status:    'offline',
          container: 'openclaw-openclaw-gateway-1',
        },
      ],
    },

    /* ── 3. Schnellzugriff (2-spaltige Linkliste) ── */
    {
      id:    'schnellzugriff',
      title: 'Schnellzugriff',
      type:  'quicklinks',
      columns: [
        [
          { name: 'Cockpit',    icon: 'terminal',    url: '#', label: ':9090',       container: 'cockpit'    },
          { name: 'Adminer',    icon: 'database',    url: '#', label: ':8080',       container: 'adminer'    },
          { name: 'Mailserver', icon: 'mail',        url: '#', label: 'mail.local',  container: 'mailserver' },
          { name: 'Pi-hole',    icon: 'wifi',        url: '#', label: ':8053/admin', container: 'pihole'     },
        ],
        [
          { name: 'Prometheus', icon: 'box',         url: '#', label: ':9090',       container: 'prometheus' },
          { name: 'Gotify',     icon: 'send',        url: '#', label: ':8070',       container: 'gotify'     },
          { name: 'Authelia',   icon: 'key',         url: '#', label: 'auth.local',  container: 'authelia'   },
          { name: 'Grafana',    icon: 'bar-chart-2', url: '#', label: ':3000',       container: 'grafana'    },
        ],
      ],
    },

  ], // end sections
}; // end DASHBOARD_CONFIG
