<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoomRequest extends FormRequest
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
            'property_id' => [
                'required',
                Rule::exists('properties', 'id')->where('user_id', $this->user()->id),
            ],
            'room_number' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['available', 'occupied', 'maintenance'])],
            'description' => ['nullable', 'string'],
        ];
    }
}
