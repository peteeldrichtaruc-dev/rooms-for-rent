<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'in:pending,paid,overdue,cancelled'],
            'payment_method' => ['nullable', 'string', 'max:100'],
            'paid_at' => ['nullable', 'required_if:status,paid', 'date'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
