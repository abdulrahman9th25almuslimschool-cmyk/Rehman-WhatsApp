// ============================================
//   WhatsApp Clone — script.js  (FIXED)
// ============================================

// ── Data ──────────────────────────────────
const contacts = [
  {
    id: 1,
    name: "Sara Ahmed",
    initials: "SA",
    avatarClass: "av-blue",
    status: "online",
    time: "12:45",
    preview: "Aaj meeting kitne baje hai?",
    unread: 3,
    messages: [
      { type: "received", text: "Assalam o Alaikum! Kya haal hai? 😊", time: "12:30" },
      { type: "sent",     text: "Walaikum assalam! Alhamdulillah sab theek hai. Aap sunao? 😄", time: "12:31", read: true },
      { type: "received", text: "Yaar aaj office mein kuch kaam tha, thak gaya hun.", time: "12:34" },
      { type: "sent",     text: "Aram karo yaar, aaj weekend hai!", time: "12:35", read: true },
      { type: "received", text: "Aaj meeting kitne baje hai? Zoom par hogi?", time: "12:45" },
    ]
  },
  {
    id: 2,
    name: "Ali Khan",
    initials: "AK",
    avatarClass: "av-amber",
    status: "last seen 1h ago",
    time: "11:30",
    preview: "Kal milte hain, theek hai?",
    unread: 0,
    messages: [
      { type: "sent",     text: "Bhai kab free ho?", time: "11:00", read: true },
      { type: "received", text: "Aaj busy hun, kal?", time: "11:20" },
      { type: "sent",     text: "Theek hai kal 10 baje?", time: "11:25", read: true },
      { type: "received", text: "Kal milte hain, theek hai? 👍", time: "11:30" },
    ]
  },
  {
    id: 3,
    name: "Dev Team 🛠",
    initials: "DT",
    avatarClass: "av-purple",
    status: "5 members",
    time: "10:15",
    preview: "Usman: Deploy ho gaya!",
    unread: 7,
    messages: [
      { type: "received", text: "Usman: Koi bug toh nahi aaya staging par?", time: "09:50" },
      { type: "received", text: "Hamza: Main check kar raha hun...", time: "10:00" },
      { type: "sent",     text: "Main bhi dekh raha hun logs.", time: "10:05", read: true },
      { type: "received", text: "Usman: Sab clear hai! Deploy ho gaya! 🚀", time: "10:15" },
    ]
  },
  {
    id: 4,
    name: "Zara Noor",
    initials: "ZN",
    avatarClass: "av-pink",
    status: "last seen today",
    time: "Yesterday",
    preview: "Haha, bilkul sahi kaha! 😄",
    unread: 0,
    messages: [
      { type: "sent",     text: "Woh movie kaisi thi?", time: "Yest 9:00", read: true },
      { type: "received", text: "Zabardast thi! Bilkul meri expectation se zyada acchi nikli.", time: "Yest 9:05" },
      { type: "sent",     text: "Hahaha main bhi yahi soch raha tha!", time: "Yest 9:06", read: true },
      { type: "received", text: "Haha, bilkul sahi kaha! 😄", time: "Yest 9:07" },
    ]
  },
  {
    id: 5,
    name: "Mama",
    initials: "MA",
    avatarClass: "av-teal",
    status: "online",
    time: "Yesterday",
    preview: "Khana kha liya?",
    unread: 0,
    messages: [
      { type: "received", text: "Beta, ghar kab aao ge?", time: "Yest 7:00" },
      { type: "sent",     text: "Ammi, 8 baje tak aa jaunga.", time: "Yest 7:02", read: true },
      { type: "received", text: "Theek hai, khana rakh deta hun.", time: "Yest 7:03" },
      { type: "received", text: "Khana kha liya? ❤️", time: "Yest 8:30" },
    ]
  },
  {
    id: 6,
    name: "Hassan Raza",
    initials: "HR",
    avatarClass: "av-green",
    status: "last seen 2h ago",
    time: "Mon",
    preview: "Bhai woh document bhej dena",
    unread: 0,
    messages: [
      { type: "received", text: "Bhai woh project document bhej dena jab time ho.", time: "Mon 3:00" },
      { type: "sent",     text: "Zaroor, kal tak bhej deta hun.", time: "Mon 3:15", read: true },
    ]
  }
];

let activeContactId = 1;

// ── Helpers ───────────────────────────────
function getTime() {
  const now = new Date();
  return now.getHours().toString().padStart(2, '0') + ':' +
         now.getMinutes().toString().padStart(2, '0');
}

function buildTicks(msg) {
  if (msg.type !== 'sent') return '';
  const cls = msg.read ? 'tick read' : 'tick';
  return '<span class="' + cls + '">✓✓</span>';
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function scrollToBottom() {
  const area = document.getElementById('messagesArea');
  area.scrollTop = area.scrollHeight;
}

// ── Create bubble element ─────────────────
function createBubbleEl(msg) {
  const wrap = document.createElement('div');
  wrap.className = 'msg-wrap ' + msg.type;
  wrap.innerHTML =
    '<div class="msg-bubble">' + escapeHtml(msg.text) + '</div>' +
    '<div class="msg-meta">' +
      '<span class="msg-time">' + msg.time + '</span>' +
      buildTicks(msg) +
    '</div>';
  return wrap;
}

// ── Render chat list ──────────────────────
function renderChatList(filter) {
  filter = filter || '';
  const list = document.getElementById('chatList');
  list.innerHTML = '';

  const filtered = contacts.filter(function(c) {
    return c.name.toLowerCase().includes(filter.toLowerCase());
  });

  filtered.forEach(function(contact) {
    const item = document.createElement('div');
    item.className = 'chat-item' + (contact.id === activeContactId ? ' active' : '');
    item.dataset.id = contact.id;

    item.innerHTML =
      '<div class="avatar ' + contact.avatarClass + '">' + contact.initials + '</div>' +
      '<div class="chat-info">' +
        '<div class="chat-name-row">' +
          '<span class="chat-name">' + contact.name + '</span>' +
          '<span class="chat-time">' + contact.time + '</span>' +
        '</div>' +
        '<div class="chat-preview">' +
          '<span>' + contact.preview + '</span>' +
          (contact.unread > 0 ? '<span class="unread-badge">' + contact.unread + '</span>' : '') +
        '</div>' +
      '</div>';

    item.addEventListener('click', function() { switchContact(contact.id); });
    list.appendChild(item);
  });
}

// ── Render messages ───────────────────────
function renderMessages(contactId) {
  const contact = contacts.find(function(c) { return c.id === contactId; });
  const area = document.getElementById('messagesArea');
  area.innerHTML = '';

  const divider = document.createElement('div');
  divider.className = 'date-divider';
  divider.innerHTML = '<span>Today</span>';
  area.appendChild(divider);

  contact.messages.forEach(function(msg) {
    area.appendChild(createBubbleEl(msg));
  });

  scrollToBottom();
}

// ── Switch contact ────────────────────────
function switchContact(id) {
  activeContactId = id;
  const contact = contacts.find(function(c) { return c.id === id; });
  contact.unread = 0;

  const headerAvatar = document.getElementById('headerAvatar');
  headerAvatar.textContent = contact.initials;
  headerAvatar.className = 'avatar ' + contact.avatarClass;
  document.getElementById('headerName').textContent = contact.name;

  const statusEl = document.getElementById('headerStatus');
  if (contact.status === 'online') {
    statusEl.innerHTML = '<span class="status-dot"></span>online';
    statusEl.style.color = 'var(--wa-green)';
  } else {
    statusEl.innerHTML = contact.status;
    statusEl.style.color = 'var(--wa-muted)';
  }

  renderChatList(document.getElementById('searchInput').value);
  renderMessages(id);
  document.getElementById('messageInput').focus();
}

// ── Send message ──────────────────────────
function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  if (!text) return;

  const contact = contacts.find(function(c) { return c.id === activeContactId; });
  const msg = { type: 'sent', text: text, time: getTime(), read: false };

  contact.messages.push(msg);
  contact.preview = text;
  contact.time = msg.time;

  const area = document.getElementById('messagesArea');
  area.appendChild(createBubbleEl(msg));
  scrollToBottom();

  input.value = '';
  input.style.height = 'auto';
  input.focus();

  renderChatList(document.getElementById('searchInput').value);

  setTimeout(function() { simulateReply(contact); }, 1500);
}

// ── Simulate reply ────────────────────────
const autoReplies = [
  "Theek hai, samajh gaya! 👍",
  "Bilkul, abhi baat karte hain.",
  "Haan yaar, sahi keh rahe ho!",
  "Ok ok, kal tak ho jaega.",
  "Shukriya! ❤️",
  "Acha bataao, kya plan hai?",
  "Main check karke batata hun.",
  "👌 Done!",
  "Zaroor bhai!",
  "Haha theek hai 😄",
];

function simulateReply(contact) {
  const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
  const msg = { type: 'received', text: replyText, time: getTime() };
  contact.messages.push(msg);
  contact.preview = replyText;
  contact.time = msg.time;

  if (contact.id === activeContactId) {
    const area = document.getElementById('messagesArea');
    area.appendChild(createBubbleEl(msg));
    scrollToBottom();
  } else {
    contact.unread = (contact.unread || 0) + 1;
  }

  renderChatList(document.getElementById('searchInput').value);

  setTimeout(function() {
    contact.messages.forEach(function(m) {
      if (m.type === 'sent') m.read = true;
    });
    if (contact.id === activeContactId) renderMessages(activeContactId);
  }, 800);
}

// ── Auto-resize textarea ──────────────────
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ── Add Contact Modal ─────────────────────
let selectedColor = 'av-blue';

function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('formError').style.display = 'none';
  document.getElementById('newName').value = '';
  document.getElementById('newPhone').value = '';
  document.getElementById('newStatus').value = 'online';
  selectedColor = 'av-blue';
  document.querySelectorAll('.color-dot').forEach(function(d) {
    d.classList.toggle('selected', d.dataset.color === 'av-blue');
  });
  setTimeout(function() { document.getElementById('newName').focus(); }, 100);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function addContact() {
  const name   = document.getElementById('newName').value.trim();
  const phone  = document.getElementById('newPhone').value.trim();
  const status = document.getElementById('newStatus').value;
  const errEl  = document.getElementById('formError');

  if (!name) {
    errEl.textContent = '⚠️ Naam zaroor likhein!';
    errEl.style.display = 'block';
    document.getElementById('newName').focus();
    return;
  }

  const duplicate = contacts.find(function(c) {
    return c.name.toLowerCase() === name.toLowerCase();
  });
  if (duplicate) {
    errEl.textContent = '⚠️ Yeh contact pehle se maujood hai!';
    errEl.style.display = 'block';
    return;
  }

  errEl.style.display = 'none';

  const greeting = phone
    ? 'Assalam o Alaikum! Main ' + name + ' hun. Number: ' + phone
    : 'Assalam o Alaikum! Main ' + name + ' hun. 👋';

  const newContact = {
    id: Date.now(),
    name: name,
    initials: getInitials(name),
    avatarClass: selectedColor,
    status: status,
    time: getTime(),
    preview: 'Naya contact 👋',
    unread: 1,
    messages: [
      { type: 'received', text: greeting, time: getTime() }
    ]
  };

  contacts.unshift(newContact);
  closeModal();
  renderChatList(document.getElementById('searchInput').value);
  switchContact(newContact.id);
}

// ── DOMContentLoaded ──────────────────────
document.addEventListener('DOMContentLoaded', function() {

  renderChatList();
  renderMessages(activeContactId);

  // Send button click
  document.getElementById('sendBtn').addEventListener('click', function(e) {
    e.preventDefault();
    sendMessage();
  });

  // Enter key sends (Shift+Enter = new line)
  document.getElementById('messageInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  document.getElementById('messageInput').addEventListener('input', function() {
    autoResize(this);
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', function() {
    renderChatList(this.value);
  });

  // Open modal
  document.getElementById('openModalBtn').addEventListener('click', openModal);

  // Close modal
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('btnCancel').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // Add contact
  document.getElementById('btnAddContact').addEventListener('click', addContact);

  // Color picker
  document.querySelectorAll('.color-dot').forEach(function(dot) {
    dot.addEventListener('click', function() {
      selectedColor = dot.dataset.color;
      document.querySelectorAll('.color-dot').forEach(function(d) {
        d.classList.toggle('selected', d === dot);
      });
    });
  });

  // Enter in name field submits
  document.getElementById('newName').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') addContact();
  });

});
