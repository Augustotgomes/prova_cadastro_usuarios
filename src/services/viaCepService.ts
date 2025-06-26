import axios from 'axios';
import { ViaCepResponse, ApiResponse } from '../interfaces';

const VIACEP_BASE_URL = 'https://viacep.com.br/ws';

export class ViaCepService {
  private static instance: ViaCepService;

  public static getInstance(): ViaCepService {
    if (!ViaCepService.instance) {
      ViaCepService.instance = new ViaCepService();
    }
    return ViaCepService.instance;
  }

  /**
   * Busca endereço por CEP
   * @param cep CEP no formato XXXXX-XXX ou XXXXXXXX
   * @returns Promise com dados do endereço
   */
  public async getAddressByCep(cep: string): Promise<ApiResponse<ViaCepResponse>> {
    try {
      // Remove formatação do CEP
      const cleanCep = cep.replace(/\D/g, '');
      
      // Valida formato do CEP
      if (cleanCep.length !== 8) {
        return {
          data: undefined,
          error: {
            message: 'CEP deve conter 8 dígitos',
            code: 'INVALID_CEP_FORMAT'
          },
          loading: false
        };
      }

      const response = await axios.get<ViaCepResponse>(
        `${VIACEP_BASE_URL}/${cleanCep}/json/`,
        {
          timeout: 10000, // 10 segundos
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      // Verifica se o CEP foi encontrado
      if (response.data.erro) {
        return {
          data: undefined,
          error: {
            message: 'CEP não encontrado',
            code: 'CEP_NOT_FOUND'
          },
          loading: false
        };
      }

      return {
        data: response.data,
        error: undefined,
        loading: false
      };

    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      
      let errorMessage = 'Erro ao buscar CEP';
      let errorCode = 'UNKNOWN_ERROR';

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Timeout na consulta do CEP';
          errorCode = 'TIMEOUT';
        } else if (error.response?.status === 404) {
          errorMessage = 'CEP não encontrado';
          errorCode = 'CEP_NOT_FOUND';
        } else if (!navigator.onLine) {
          errorMessage = 'Sem conexão com a internet';
          errorCode = 'NO_INTERNET';
        }
      }

      return {
        data: undefined,
        error: {
          message: errorMessage,
          status: error instanceof Error ? undefined : (error as any).response?.status,
          code: errorCode
        },
        loading: false
      };
    }
  }

  /**
   * Valida formato do CEP
   * @param cep CEP a ser validado
   * @returns true se o CEP é válido
   */
  public validateCep(cep: string): boolean {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  }

  /**
   * Formata CEP para exibição
   * @param cep CEP sem formatação
   * @returns CEP formatado (XXXXX-XXX)
   */
  public formatCep(cep: string): string {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
    }
    return cep;
  }
}

export const viaCepService = ViaCepService.getInstance();

