7. Testing Checklist
                                                                                     
  Must test before shipping:                                                         
                                         
  - Submit empty prompt → shows validation error
  - Submit prompt with 1000+ characters → truncated or error
  - Disconnect network mid-generation → handles gracefully, shows error              
  - Click generate 5 times rapidly → prevents double-submit                          
  - Long-running generation (>10 min) → polling doesn't timeout                      
  - Rate limiting (429 error) → backs off correctly                                  
  - API returns malformed response → normalizes or shows error                       
  - Image upload 5MB+ → validates size before sending                                
  - PixVerse returns status code 7/8 (failed) → shows error with retry               
  - Generation succeeds after 1 retry → output displays                              
  - Model selection on Auto → picks correct model for input constraints              
  - Sound effects parameter missing → uses default                                   
  - User closes tab during generation → no memory leak                               
                                                         