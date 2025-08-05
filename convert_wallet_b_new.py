import base58
import json

private_key_string = "5XchEkf3LZEJnwuadHZeygwKqvpF1Gn69Pgiphov6p6Mzuvv9DaKjgSZngiWoAV7sR448hyt6k42Y3mNihh2XpAV"

try:
    private_key_bytes = base58.b58decode(private_key_string)
    keypair_array = list(private_key_bytes)
    print(f"Keypair array: {keypair_array}")
    
    with open('config/wallet_b.json', 'w') as f:
        json.dump(keypair_array, f)
    
    print("✅ Nuovo Wallet B salvato in config/wallet_b.json")
    
except Exception as e:
    print(f"Errore: {e}") 