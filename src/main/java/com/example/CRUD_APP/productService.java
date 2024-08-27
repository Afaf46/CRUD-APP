package com.example.CRUD_APP;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Sort;

import org.springframework.stereotype.Service;


import java.util.List;

import java.util.stream.Collectors;


@Service
public class productService {


    private final  Reposiatry reposiatry;

    @Autowired
    public productService(Reposiatry reposiatry){
        this.reposiatry=reposiatry;
    }

    public List<Product> filterByDescriptionAndSort(String description, String sortOrder) {
        try {
            if (description == null) {
                description = "";
            }
            if ("asc".equals(sortOrder)) {
                return reposiatry.findByDescriptionContainingIgnoreCaseOrderByIdAsc(description);
            } else if ("desc".equals(sortOrder)) {
                return reposiatry.findByDescriptionContainingIgnoreCaseOrderByIdDesc(description);
            } else {
                return reposiatry.findByDescriptionContainingIgnoreCase(description);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }





    public void deleteMultipleProducts(List<Long> ids) {
        reposiatry.deleteAllById(ids);
    }
    public List<Product> findall(){
        return reposiatry.findAll();
    }




    public List<Product> findAllSortedById(String sortOrder) {
        Sort sort = Sort.by(Sort.Order.by("id"));
        if ("desc".equalsIgnoreCase(sortOrder)) {
            sort = sort.descending();
        }
        return reposiatry.findAll(sort);
    }


    public List<Product> search(String query) {
        return reposiatry.findAll().stream()
                .filter(product -> product.getName().toLowerCase().contains(query.toLowerCase()) ||
                        product.getDescription().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }


    public List<Product> filterByDescription(String description) {
        return reposiatry.findAll().stream()
                .filter(product -> product.getDescription().toLowerCase().contains(description.toLowerCase()))
                .collect(Collectors.toList());
    }


    public Product findbyid(Long id){
        return reposiatry.findById(id).orElse(null);
    }


    public Product save (Product product){
        return reposiatry.save(product);
    }


    public void deleteById(Long id) {
        reposiatry.deleteById(id);
    }
}


