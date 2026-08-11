import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Wrench, Ban, CheckCircle2 } from 'lucide-react';
import { format, isBefore, startOfToday, isSameDay, getDay } from 'date-fns';

interface AdvancedBookingCalendarProps {
  maintenanceDay: number; // 0=Sunday..6=Saturday
  maintenanceEnabled: boolean;
  bookedSlots: { booking_date: string; time_slot: string }[];
  selectedDate: string;
  selectedSlot: string;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: string) => void;
}

export const AdvancedBookingCalendar: React.FC<AdvancedBookingCalendarProps> = ({
  maintenanceDay,
  maintenanceEnabled,
  bookedSlots,
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
}) => {
  const { language, t } = useLanguage();

  const today = startOfToday();
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 = August

  const availableTimeSlots = [
    '06:00 AM',
    '08:00 AM',
    '10:00 AM',
    '12:00 PM',
    '02:00 PM',
    '04:00 PM',
  ];

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesKn = [
    'ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್',
    'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್'
  ];

  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesKn = ['ಭಾನು', 'ಸೋಮ', 'ಮಂಗಳ', 'ಬುಧ', 'ಗುರು', 'ಶುಕ್ರ', 'ಶನಿ'];

  const fullDayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const fullDayNamesKn = ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'];

  const monthNames = language === 'kn' ? monthNamesKn : monthNamesEn;
  const dayNames = language === 'kn' ? dayNamesKn : dayNamesEn;
  const fullDayNames = language === 'kn' ? fullDayNamesKn : fullDayNamesEn;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      
      {/* Calendar Card Container */}
      <div className="bg-slate-900/95 p-4 sm:p-5 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        
        {/* Month & Year Selectors Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <CalendarIcon className="w-4 h-4" />
            </div>
            
            {/* Month Dropdown */}
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white font-extrabold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {monthNames.map((m, idx) => (
                <option key={idx} value={idx}>{m}</option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white font-extrabold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Prev / Next Month Nav */}
          <div className="flex items-center space-x-1.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer border border-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer border border-white/5"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Maintenance Warning Banner */}
        {maintenanceEnabled && (
          <div className="bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-2xl flex items-center space-x-2 text-[11px] text-rose-300 font-semibold">
            <Wrench className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{t('calendar.maintenance_warning', { day: fullDayNames[maintenanceDay] })}</span>
          </div>
        )}

        {/* Day of Week Labels */}
        <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-slate-400 text-[10px] uppercase tracking-wider">
          {dayNames.map((d, i) => (
            <div
              key={d}
              className={`py-1.5 rounded-lg ${
                i === maintenanceDay && maintenanceEnabled ? 'text-rose-400 bg-rose-950/20' : ''
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty prefix slots */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dateObj = new Date(currentYear, currentMonth, dayNum);
            
            const isPast = isBefore(dateObj, today);
            const isMaintenance = maintenanceEnabled && getDay(dateObj) === maintenanceDay;
            const isSelected = selectedDate === dateStr;

            // Check if all slots are booked for this date
            const bookedCountForDate = bookedSlots.filter((b) => b.booking_date === dateStr).length;
            const isFullyBooked = bookedCountForDate >= availableTimeSlots.length;

            let buttonClass = 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 border border-white/5';
            let tooltip = dateStr;

            if (isMaintenance) {
              buttonClass = 'bg-rose-950/40 text-rose-400 border border-rose-500/30 cursor-not-allowed';
              tooltip = `Maintenance Day (Every ${fullDayNames[maintenanceDay]})`;
            } else if (isFullyBooked) {
              buttonClass = 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed opacity-60';
              tooltip = 'All Time Slots Already Booked';
            } else if (isSelected) {
              buttonClass = 'bg-emerald-500 text-slate-950 font-black shadow-lg glow-emerald border border-emerald-400 scale-[1.03]';
            }

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isMaintenance || isFullyBooked}
                onClick={() => onSelectDate(dateStr)}
                title={tooltip}
                className={`py-2.5 px-1 rounded-2xl font-extrabold text-xs transition-all duration-150 flex flex-col items-center justify-center relative cursor-pointer ${buttonClass}`}
              >
                <span>{dayNum}</span>
                {isMaintenance ? (
                  <span className="text-[8px] font-bold text-rose-400 block uppercase leading-none mt-0.5">Maint</span>
                ) : isFullyBooked ? (
                  <span className="text-[8px] font-bold text-slate-500 block uppercase leading-none mt-0.5">Full</span>
                ) : null}
              </button>
            );
          })}
        </div>

      </div>

      {/* Time Slot Selection Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-200 flex items-center space-x-1.5 text-xs">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{t('calendar.select_slot')} <strong className="text-emerald-400">{selectedDate}</strong></span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                className={`p-3 rounded-2xl border text-center font-extrabold text-xs transition-all duration-150 cursor-pointer flex flex-col items-center justify-center space-y-0.5 ${
                  isBooked
                    ? 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed opacity-50 line-through'
                    : isSelected
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg glow-emerald'
                    : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-800'
                }`}
              >
                <span className="text-xs">{slot}</span>
                <span className="text-[9px] font-bold opacity-85">
                  {isBooked ? `❌ ${t('calendar.already_booked')}` : '🟢 Available'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
