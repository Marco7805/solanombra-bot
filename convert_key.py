import base58
import json
from solana.keypair import Keypair

# La tua chiave privata
private_key_string = "3bKQNUtuAbS7WiWAiW3njTbVsx8jEwJvPr2zppWdGf6BjCwhp9u4v7U5Xk65Afi5vZ4vLAcuKLfgGkr6qZrkEDvf"

try:
    # Decodifica la chiave base58
    private_key_bytes = base58.b58decode(private_key_string)
    
    # Crea il keypair
    keypair = Keypair.from_secret_key(private_key_bytes)
    
    # Ottieni l'indirizzo pubblico
    public_key = str(keypair.public_key)
    
    print(f"Indirizzo del wallet: {public_key}")
    print(f"Chiave privata (base58): {private_key_string}")
    
    # Salva il keypair nel formato corretto per Solana CLI
    keypair_array = list(keypair.secret_key)
    print(f"Keypair array: {keypair_array}")
    
    # Salva in file
    with open('config/your_wallet.json', 'w') as f:
        json.dump(keypair_array, f)
    
    print("Wallet salvato in config/your_wallet.json")
    
except Exception as e:
    print(f"Errore: {e}") 