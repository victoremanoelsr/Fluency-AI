-- ==========================================
-- SCRIPT SQL PARA O BANCO DE DADOS SUPABASE
-- Copie e cole no SQL Editor do seu projeto Supabase
-- ==========================================

-- 1. Tabela de Vocabulário Salvo
CREATE TABLE IF NOT EXISTS learna_vocabulary (
  id TEXT PRIMARY KEY,
  phrase TEXT NOT NULL,
  meaning TEXT,
  native_form TEXT,
  example TEXT,
  category TEXT DEFAULT 'General',
  mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabela de Histórico de Conversas com a IA
CREATE TABLE IF NOT EXISTS learna_messages (
  id BIGSERIAL PRIMARY KEY,
  scenario_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  text TEXT NOT NULL,
  text_pt TEXT,
  correction JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Progresso e Ofensiva do Usuário
CREATE TABLE IF NOT EXISTS learna_user_stats (
  id TEXT PRIMARY KEY,
  current_streak INT DEFAULT 1,
  total_minutes INT DEFAULT 15,
  phrases_spoken INT DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar leitura/escrita pública (ideal para uso pessoal simples)
ALTER TABLE learna_vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access Vocabulary" ON learna_vocabulary FOR ALL USING (true);

ALTER TABLE learna_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access Messages" ON learna_messages FOR ALL USING (true);

ALTER TABLE learna_user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access Stats" ON learna_user_stats FOR ALL USING (true);
