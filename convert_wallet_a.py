import base58
import json

private_key_string = "3bKQNUtuAbS7WiWAiW3njTbVsx8jEwJvPr2zppWdGf6BjCwhp9u4v7U5Xk65Afi5vZ4vLAcuKLfgGkr6qZrkEDvf"

try:
    private_key_bytes = base58.b58decode(private_key_string)
    keypair_array = list(private_key_bytes)
    print(f"Keypair array: {keypair_array}")
    
    with open('config/your_wallet.json', 'w') as f:
        json.dump(keypair_array, f)
    
    print("✅ Wallet A salvato in config/your_wallet.json")
    
except Exception as e:
    print(f"Errore: {e}") 