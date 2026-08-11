import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle2, Wrench } from 'lucide-react';

interface CalendarPickerProps {
  maintenanceDay: number; // 0=Sunday..6=Saturday
  maintenanceEnabled: boolean;
  bookedSlots: { booking_date: string; time_slot: string }[];
  selectedDate: string;
  selectedSlot: string;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: string) => void;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  maintenanceDay,
  maintenanceEnabled,
  bookedSlots,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1)); // August 2026

  const availableTimeSlots = [
    '06:00 AM',
    '08:00 AM',
    '10:00 AM',
    '12:00 PM',
    '02:00 PM',
    '04:00 PM',
  ];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="space-y-4 text-xs">
      
      {/* Calendar Header */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-sm text-white">
              {monthNames[month]} {year}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Maintenance Indicator Note */}
        {maintenanceEnabled && (
          <div className="bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-[11px] text-amber-300 font-semibold">
            <Wrench className="w-3.5 h-3.5 shrink-0" />
            <span>Weekly Maintenance: Every {fullDayNames[maintenanceDay]} (Bookings Disabled)</span>
          </div>
        )}

        {/* Day Grid Headers */}
        <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-slate-400 text-[10px]">
          {dayNames.map((d, i) => (
            <div key={d} className={`py-1 ${i === maintenanceDay && maintenanceEnabled ? 'text-amber-400' : ''}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dateObj = new Date(year, month, dayNum);
            const isMaintenance = maintenanceEnabled && dateObj.getDay() === maintenanceDay;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isMaintenance}
                onClick={() => onSelectDate(dateStr)}
                title={isMaintenance ? `Maintenance Day (Every ${fullDayNames[maintenanceDay]})` : dateStr}
                className={`py-2 rounded-xl font-bold text-xs transition flex flex-col items-center justify-center relative cursor-pointer ${
                  isMaintenance
                    ? 'bg-rose-950/30 text-rose-500/50 border border-rose-500/20 cursor-not-allowed line-through'
                    : isSelected
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md glow-emerald'
                    : 'bg-slate-800/60 text-slate-200 hover:bg-slate-700 border border-white/5'
                }`}
              >
                <span>{dayNum}</span>
                {isMaintenance && (
                  <span className="text-[8px] no-underline font-normal text-rose-400 block">Maint</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-300 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select Available Time Slot on {selectedDate}</span>
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {availableTimeSlots.map((slot) => {
            const isBooked = bookedSlots.some(
              (b) => b.booking_date === selectedDate && b.time_slot === slot
            );
            const isSelected = selectedSlot === slot;

            return (
              <button
                key={slot}
                type="button"
                disabled={isBooked}
                onClick={() => onSelectSlot(slot)}
                className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                  isBooked
                    ? 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed line-through opacity-50'
                    : isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md glow-emerald'
                    : 'bg-slate-900/80 text-slate-300 border-white/5 hover:bg-slate-800'
                }`}
              >
                <span>{slot}</span>
                <span className="block text-[9px] font-normal opacity-80 mt-0.5">
                  {isBooked ? '❌ Booked' : '🟢 Available'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
