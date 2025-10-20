import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FormUser from '@/pages/Auth/User/FormUser';
import cepUtils from '@/utils/cepUtils';

vi.mock('@/utils/cepUtils', () => ({
  default: {
    fetchAddress: vi.fn(),
  },
}));

const FormUserWrapper = (props: any) => {
  const [form] = Form.useForm();
  return <FormUser {...props} form={form} />;
};

describe('FormUser', () => {
  const mockOnFinish = vi.fn();
  const mockSetAddressFieldsDisabled = vi.fn();

  const defaultProps = {
    onFinish: mockOnFinish,
    addressFieldsDisabled: true,
    setAddressFieldsDisabled: mockSetAddressFieldsDisabled,
    isEditing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza todos os campos do formulário', () => {
    render(<FormUserWrapper {...defaultProps} />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cep/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rua/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número/i)).toBeInTheDocument();
  });

  it('busca endereço ao pesquisar CEP válido', async () => {
    const user = userEvent.setup();
    const mockAddress = {
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Centro',
      street: 'Rua Teste',
    };

    vi.mocked(cepUtils.fetchAddress).mockResolvedValue(mockAddress);

    render(<FormUserWrapper {...defaultProps} />);

    const cepInput = screen.getByLabelText(/cep/i);
    await user.type(cepInput, '01001-000');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(cepUtils.fetchAddress).toHaveBeenCalledWith('01001-000');
      expect(mockSetAddressFieldsDisabled).toHaveBeenCalledWith(false);
    });
  });

  it('desabilita campos de endereço quando CEP é inválido', async () => {
    const user = userEvent.setup();
    vi.mocked(cepUtils.fetchAddress).mockRejectedValue(new Error('CEP inválido'));

    render(<FormUserWrapper {...defaultProps} />);

    const cepInput = screen.getByLabelText(/cep/i);
    await user.type(cepInput, '00000-000');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockSetAddressFieldsDisabled).toHaveBeenCalledWith(true);
    });
  });

  it('mostra placeholder diferente na senha quando está editando', () => {
    render(<FormUserWrapper {...defaultProps} isEditing={true} />);

    const passwordInput = screen.getByPlaceholderText(/deixe em branco/i);
    expect(passwordInput).toBeInTheDocument();
  });

  it('campos de endereço ficam desabilitados quando addressFieldsDisabled é true', () => {
    render(<FormUserWrapper {...defaultProps} addressFieldsDisabled={true} />);

    expect(screen.getByLabelText(/estado/i)).toBeDisabled();
    expect(screen.getByLabelText(/cidade/i)).toBeDisabled();
    expect(screen.getByLabelText(/rua/i)).toBeDisabled();
  });
});