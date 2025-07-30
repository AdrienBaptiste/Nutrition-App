import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parse, startOfWeek, getDay, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import MainLayout from '../components/templates/MainLayout';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const locales = {
  fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface MealEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: 'meal';
}

interface WeightEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: 'weight';
}

type CalendarEvent = MealEvent | WeightEvent;

const CalendarPage: React.FC = () => {
  const { jwt } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<'month'>('month');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!jwt) {
        setError('Non authentifié');
        setLoading(false);
        return;
      }
      try {
        // Fetch meals
        const mealRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/meals`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const weightRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/weights`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const mealData = await mealRes.json();
        const weightData = await weightRes.json();
        const meals = Array.isArray(mealData) ? mealData : mealData.member || [];
        const weights = Array.isArray(weightData) ? weightData : weightData.member || [];
        // Map meals
        const mealEvents: MealEvent[] = meals.map((meal: Record<string, unknown>) => ({
          id: meal.id as number,
          title: (meal.name as string) || 'Repas',
          start: new Date(meal.date as string),
          end: new Date(meal.date as string),
          type: 'meal',
        }));
        // Map weights
        const weightEvents: WeightEvent[] = weights.map((weight: Record<string, unknown>) => ({
          id: weight.id as number,
          title: `Poids: ${weight.value as number} kg`,
          start: new Date(weight.date as string),
          end: new Date(weight.date as string),
          type: 'weight',
        }));
        setEvents([...mealEvents, ...weightEvents]);
      } catch {
        setError('Erreur lors du chargement des événements');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [jwt]);

  // Custom event style
  const eventPropGetter = (event: CalendarEvent) => {
    if (event.type === 'meal') {
      return { style: { backgroundColor: '#4f46e5', color: 'white' } };
    }
    if (event.type === 'weight') {
      return { style: { backgroundColor: '#10b981', color: 'white' } };
    }
    return {};
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Chargement du calendrier..." />
      </MainLayout>
    );
  }
  if (error) {
    return (
      <MainLayout>
        <div className="text-red-600 text-center py-10">{error}</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-2 md:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Calendrier</h1>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700, position: 'relative', zIndex: 1 }}
          views={['month']}
          view={view}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          onView={(newView) => setView(newView as 'month')}
          eventPropGetter={eventPropGetter}
          popup
        />
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
