<?php

namespace App\Mail;

use App\Models\ProductQuestion;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuestionAnsweredMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ProductQuestion $question) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Question Has Been Answered',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.question_answered',
            with: [
                'question' => $this->question,
                'product' => $this->question->product,
                'answer' => $this->question->answer,
            ],
        );
    }
}
