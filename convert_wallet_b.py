import base58
import json

private_key_string = "g7Zr6GduH9gC4U1LGKZMT7WGMMTY2nv8EK5aSKYTowTjvUTVJnFCw92NRC1g8iAfFedW6nRqHypy8Bim3BTi78s"

try:
    private_key_bytes = base58.b58decode(private_key_string)
    keypair_array = list(private_key_bytes)
    print(f"Keypair array: {keypair_array}")
    
    with open('config/wallet_b.json', 'w') as f:
        json.dump(keypair_array, f)
    
    print("✅ Wallet B salvato in config/wallet_b.json")
    
except Exception as e:
    print(f"Errore: {e}") 