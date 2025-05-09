/**
 * Utilidades de encriptación y tokens JWT para manejo seguro de datos
 */
// Usar require para evitar problemas de tipo con TypeScript
const jwt = require('jsonwebtoken');
import CryptoJS from 'crypto-js';

// Claves seguras - asegúrate de tener estas variables en .env.local
// Usar valores por defecto solo para desarrollo
const getJwtSecret = (): string => {
  return (process.env.JWT_SECRET as string) || 'clave-temporal-para-desarrollo';
};

const getEncryptionKey = (): string => {
  return (process.env.ENCRYPTION_KEY as string) || 'clave-temp-desarrollo-no-usar-produccion';
};

/**
 * Genera un token JWT para almacenar datos temporales del formulario
 * @param data Datos a almacenar en el token
 * @param expiresIn Tiempo de expiración (default: 1 hora)
 */
export function generateFormToken(data: any, expiresIn: string = '1h'): string {
  // Asegurar que usamos el secret como string
  const secret = getJwtSecret();
  
  // Esta sintaxis funciona con require (sin problemas de tipo)
  return jwt.sign(
    { data }, 
    secret, 
    { expiresIn }
  );
}

/**
 * Verifica y extrae datos de un token JWT
 * @param token Token JWT a verificar
 * @returns Datos del token o null si es inválido
 */
export function verifyFormToken(token: string): any | null {
  try {
    // Usar la función segura para obtener el secret
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);
    return typeof decoded === 'object' && decoded ? decoded.data : null;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return null;
  }
}

/**
 * Encripta datos con AES
 * @param data Datos a encriptar
 * @returns String encriptado
 */
export function encrypt(data: string): string {
  // Usar la función segura para obtener la clave
  const key = getEncryptionKey();
  return CryptoJS.AES.encrypt(data, key).toString();
}

/**
 * Desencripta datos con AES
 * @param encryptedData String encriptado
 * @returns Datos desencriptados o null si hay error
 */
export function decrypt(encryptedData: string): string | null {
  try {
    // Usar la función segura para obtener la clave
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error al desencriptar:', error);
    return null;
  }
}

/**
 * Encripta y guarda datos en una cookie segura
 * @param cookieStore Store de cookies de Next.js
 * @param name Nombre de la cookie
 * @param data Datos a guardar
 * @param maxAge Tiempo de vida en segundos (default: 1 hora)
 */
export function setSecureCookie(cookieStore: any, name: string, data: any, maxAge: number = 3600): void {
  try {
    // Convertir a string si no lo es
    const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Encriptar datos
    const encryptedData = encrypt(dataStr);
    
    // Guardar en cookie
    cookieStore.set({
      name,
      value: encryptedData,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
      path: '/'
    });
  } catch (error) {
    console.error('Error al guardar cookie segura:', error);
  }
}

/**
 * Lee y desencripta datos de una cookie segura
 * @param cookieStore Store de cookies de Next.js
 * @param name Nombre de la cookie
 * @returns Datos desencriptados o null
 */
export function getSecureCookie(cookieStore: any, name: string): any {
  try {
    // Obtener cookie
    const cookie = cookieStore.get(name);
    if (!cookie?.value) return null;
    
    // Desencriptar
    const decryptedStr = decrypt(cookie.value);
    if (!decryptedStr) return null;
    
    // Parsear JSON si es necesario
    try {
      return JSON.parse(decryptedStr);
    } catch {
      // Si no es JSON, devolver el string
      return decryptedStr;
    }
  } catch (error) {
    console.error('Error al leer cookie segura:', error);
    return null;
  }
}
