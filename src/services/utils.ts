/**
 * Formata CPF para exibição
 * @param cpf CPF sem formatação
 * @returns CPF formatado (XXX.XXX.XXX-XX)
 */
export function formatCpf(cpf: string): string {
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length === 11) {
    return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9)}`;
  }
  return cpf;
}

/**
 * Formata telefone para exibição
 * @param phone Telefone sem formatação
 * @returns Telefone formatado ((XX) XXXXX-XXXX)
 */
export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  } else if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  }
  return phone;
}

/**
 * Formata CEP para exibição
 * @param cep CEP sem formatação
 * @returns CEP formatado (XXXXX-XXX)
 */
export function formatCep(cep: string): string {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length === 8) {
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
  }
  return cep;
}

/**
 * Formata data para exibição brasileira
 * @param date Data no formato ISO (YYYY-MM-DD)
 * @returns Data formatada (DD/MM/YYYY)
 */
export function formatDate(date: string): string {
  if (!date) return '';
  
  const parts = date.split('-');
  if (parts.length !== 3) return date;
  
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/**
 * Converte data brasileira para formato ISO
 * @param date Data no formato DD/MM/YYYY
 * @returns Data no formato ISO (YYYY-MM-DD)
 */
export function parseDate(date: string): string {
  if (!date) return '';
  
  const [day, month, year] = date.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Valida CPF
 * @param cpf CPF a ser validado
 * @returns true se o CPF é válido
 */
export function validateCpf(cpf: string): boolean {
  const cleanCpf = cpf.replace(/\D/g, '');
  
  if (cleanCpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.charAt(10))) return false;
  
  return true;
}

/**
 * Valida email
 * @param email Email a ser validado
 * @returns true se o email é válido
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Remove caracteres não numéricos
 * @param value Valor a ser limpo
 * @returns Valor apenas com números
 */
export function onlyNumbers(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Capitaliza primeira letra de cada palavra
 * @param text Texto a ser capitalizado
 * @returns Texto capitalizado
 */
export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Trunca texto com reticências
 * @param text Texto a ser truncado
 * @param maxLength Tamanho máximo
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  if (maxLength <= 3) return '...';
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Debounce function para otimizar chamadas de API
 * @param func Função a ser executada
 * @param delay Delay em milissegundos
 * @returns Função com debounce aplicado
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

