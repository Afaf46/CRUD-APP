package com.example.CRUD_APP;



import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

//import static com.sun.beans.introspect.PropertyInfo.Name.description;

@RequestMapping("/product")
@Controller
public class productController {


    private final productService productService;

    @Autowired
    public productController(com.example.CRUD_APP.productService productService) {
        this.productService = productService;
    }


    @GetMapping
    public String listProducts(@RequestParam(name = "showModal", required = false) boolean showModal,
                               @RequestParam(name = "sort", required = false, defaultValue = "") String sortOrder,
                               Model model) {
        List<Product> products = productService.findAllSortedById(sortOrder);

        model.addAttribute("products", products);
        model.addAttribute("product", new Product());
        model.addAttribute("showModal", showModal);
        model.addAttribute("sortOrder", sortOrder);
        model.addAttribute("isMainPage", true);
        return "product-list";
    }


    @GetMapping("/search")
    public String searchProducts(@RequestParam("query") String query, Model model) {
        List<Product> products = productService.search(query);
        model.addAttribute("products", products);
        model.addAttribute("product", new Product());
        model.addAttribute("showModal", false);
        model.addAttribute("noResults", products.isEmpty());
        model.addAttribute("isMainPage", false);
        return "product-list";
    }


    @GetMapping("/filter")
    public String filterProducts(@RequestParam("description") String description,
                                 @RequestParam(name = "sort", required = false, defaultValue = "") String sortOrder,
                                 Model model) {
        List<Product> products = productService.filterByDescriptionAndSort(description, sortOrder);
        model.addAttribute("products", products);
        model.addAttribute("product", new Product());
        model.addAttribute("showModal", false);
        model.addAttribute("noResults", products.isEmpty());
        model.addAttribute("sortOrder", sortOrder);
        model.addAttribute("description", description);
        model.addAttribute("isMainPage", false);
        return "product-list";
    }





    @PostMapping("/save")
    public String saveProduct(@ModelAttribute @Valid Product product, BindingResult result, Model model, RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            List<Product> products = productService.findall();
            model.addAttribute("products", products);
            model.addAttribute("product", product);
            model.addAttribute("showModal", true);
            return "product-list";
        }

        try {
            productService.save(product);
            redirectAttributes.addFlashAttribute("message", "Product added successfully!");
        } catch (Exception e) {

            redirectAttributes.addFlashAttribute("errorMessage", "An error occurred while saving the product.");
            return "redirect:/product";
        }

        return "redirect:/product";
    }





    @PostMapping("/save-api")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> saveProductapi(@Valid @ModelAttribute Product product, BindingResult result) {
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            response.put("success", false);


            Map<String, String> errors = new LinkedHashMap<>();
            result.getFieldErrors().forEach(fieldError ->
                    errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage()));

            response.put("errors", errors);
            return ResponseEntity.ok(response);
        }


        productService.save(product);
        response.put("success", true);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/edit/{id}")
    @ResponseBody
    public ResponseEntity<Product> getProductForEdit(@PathVariable("id") Long id) {
        Product product = productService.findbyid(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/delete/{id}")
    public String deleteProduct(@PathVariable("id") Long id,
                                @RequestParam Map<String, String> params,
                                RedirectAttributes redirectAttributes) {
        productService.deleteById(id);

        if (params.containsKey("description")) {
            redirectAttributes.addAttribute("description", params.get("description"));
        }
        if (params.containsKey("sort")) {
            redirectAttributes.addAttribute("sort", params.get("sort"));
        }

        return "redirect:/product/filter";
    }


    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, Object>> deleteMultipleProducts(
            @RequestParam("ids") List<Long> ids,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "sort", required = false) String sortOrder) {
        try {
            productService.deleteMultipleProducts(ids);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("description", description);
            response.put("sort", sortOrder);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }





}






