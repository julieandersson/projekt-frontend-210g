// interface för recensions-errors

export interface ReviewErrors {
    reviewText?: string;
    rating?: string;
    general?: string; // bara för extra säkerhet och "best practice", för tex utloggad användare
}