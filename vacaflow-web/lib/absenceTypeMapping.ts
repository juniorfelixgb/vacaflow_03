import { AbsenceType } from './types';

export function getAbsenceTypeEmoji(code: string): string {
  switch (code.toLowerCase()) {
    case 'vacation':
      return '🏝️';
    case 'sick':
      return '🤒';
    case 'personal':
      return '📋';
    default:
      return '📝';
  }
}

export function getAbsenceTypeName(absenceType: AbsenceType): string {
  return absenceType.nameEn || absenceType.code;
}

export function formatAbsenceTypeWithCode(absenceType: AbsenceType): string {
  const codeDisplay = absenceType.code.toUpperCase();
  return `${getAbsenceTypeName(absenceType)} (${codeDisplay})`;
}
