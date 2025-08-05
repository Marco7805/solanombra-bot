import base58
import json

# La tua chiave privata
private_key_string = "g7Zr6GduH9gC4U1LGKZMT7WGMMTY2nv8EK5aSKYTowTjvUTVJnFCw92NRC1g8iAfFedW6nRqHypy8Bim3BTi78s"

try:
    # Decodifica la chiave base58
    private_key_bytes = base58.b58decode(private_key_string)
    
    # Converti in array di byte
    keypair_array = list(private_key_bytes)
    
    print(f"Chiave privata (base58): {private_key_string}")
    print(f"Lunghezza chiave: {len(keypair_array)} byte")
    print(f"Keypair array: {keypair_array}")
    
    # Salva in file
    with open('config/wallet_b.json', 'w') as f:
        json.dump(keypair_array, f)
    
    print("Wallet salvato in config/your_wallet.json")
    
except Exception as e:
    print(f"Errore: {e}") 