-- Create enum for muscle groups
CREATE TYPE muscle_group AS ENUM ('bicep', 'tricep', 'costas', 'abdominais', 'pernas', 'gemeos');

-- Create enum for workout types
CREATE TYPE workout_type AS ENUM ('gym', 'run');

-- Create exercise_types table to store unique exercise names with their muscle group
CREATE TABLE IF NOT EXISTS public.exercise_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    muscle_group muscle_group,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, name)
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type workout_type NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT now(),

    -- Gym workout fields
    exercise TEXT,
    exercise_type_id UUID REFERENCES public.exercise_types(id) ON DELETE SET NULL,
    muscle_group muscle_group,
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(10, 2),

    -- Running workout fields
    distance DECIMAL(10, 2),
    pace TEXT,

    -- Common fields
    duration INTEGER, -- in minutes
    calories INTEGER,
    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_date ON public.workouts(date);
CREATE INDEX idx_workouts_type ON public.workouts(type);
CREATE INDEX idx_workouts_muscle_group ON public.workouts(muscle_group);
CREATE INDEX idx_exercise_types_user_id ON public.exercise_types(user_id);

-- Enable Row Level Security
ALTER TABLE public.exercise_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exercise_types
CREATE POLICY "Users can view their own exercise types"
    ON public.exercise_types
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise types"
    ON public.exercise_types
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise types"
    ON public.exercise_types
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise types"
    ON public.exercise_types
    FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for workouts
CREATE POLICY "Users can view their own workouts"
    ON public.workouts
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
    ON public.workouts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
    ON public.workouts
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
    ON public.workouts
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workouts_updated_at
    BEFORE UPDATE ON public.workouts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
